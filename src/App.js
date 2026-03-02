import React, { useState } from 'react';
import axios from 'axios';


function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [exibirMensagem, setExibirMensagem] = useState(false);
  const [dadosAdmin, setDadosAdmin] = useState(null); 
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [placeholderNome, setPlaceholderNome] = useState('Nome do Convidado');
  const [placeholderTel, setPlaceholderTel] = useState('DDD + Telefone (só números)');
  
  const itensPorPagina = 15;
  const telDanielle = "5583999298689"; 
  
  const enderecoFesta = "Rua Bacharel Irenaldo de Albuquerque Chaves, 201, Aeroclube, João Pessoa - PB (área de lazer do condomínio Val Paraíso)";
  const horarioFesta = "7 de Março às 14:00h";
  const linkGoogleMaps = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.271167906!2d-34.8436662!3d-7.0945864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ace83ef037e96b%3A0x6336336a1114a87e!2sR.%20Bacharel%20Irenaldo%20de%20Albuquerque%20Chaves%2C%20201%20-%20Aeroclube%2C%20Jo%C3%A3o%20Pessoa%20-%20PB%2C%2058036-460!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr";

  const validarTelefoneBR = (tel) => {
    const limpo = tel.replace(/\D/g, ''); 
    return limpo.length === 11; 
  };

  const confirmar = async () => {
    if (nome === 'spyscreen') { 
      try {
        const res = await axios.get('https://convite-rafa-backend.onrender.com/admin/lista');
        setDadosAdmin(res.data);
        return;
      } catch (e) { alert("Erro ao carregar lista"); return; }
    }

    if (!nome.trim()) return alert("Por favor, digite seu nome!");
    if (!validarTelefoneBR(telefone)) return alert("Por favor, digite um telefone válido com DDD (ex: 11999998888)");

    try {
      await axios.post('https://convite-rafa-backend.onrender.com/confirmar', { nome, telefone });
      setExibirMensagem(true);
      const mensagem = `Olá Danielle! Confirmei presença no aniversário da Rafaella! 🎂%0AConvidado: ${nome}%0ATelefone: ${telefone}`;
      
      setTimeout(() => {
        window.open(`https://wa.me/${telDanielle}?text=${mensagem}`, '_blank');
        setTimeout(() => {
          setNome(''); setTelefone(''); setExibirMensagem(false);
        }, 1000);
      }, 3000);
    } catch (error) {
      alert(error.response?.data?.message || "Erro no servidor");
      setNome(''); setTelefone('');
    }
  };

  const apagarConvidado = async (telefoneParaApagar, nomeParaApagar) => {
    if(!window.confirm(`Tem certeza que deseja apagar ${nomeParaApagar} da lista?`)) return;
    try {
      await axios.delete(`https://convite-rafa-backend.onrender.com/admin/apagar/${telefoneParaApagar}`);
      setDadosAdmin(prev => ({
        total: prev.total - 1,
        convidados: prev.convidados.filter(c => c.telefone !== telefoneParaApagar)
      }));
    } catch (e) { alert("Erro ao apagar convidado."); }
  };

  const fecharAdmin = () => { setDadosAdmin(null); setNome(''); setPaginaAtual(1); };

  // Lógica de Paginação para a Tabela
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const convidadosPaginados = dadosAdmin?.convidados.slice(indicePrimeiroItem, indiceUltimoItem) || [];
  const totalPaginas = Math.ceil((dadosAdmin?.convidados.length || 0) / itensPorPagina);

  return (
    <div className="container-principal">
      <div className="sparkle s1">⭐</div><div className="sparkle s2">✨</div><div className="sparkle s3">💖</div><div className="sparkle s4">🎈</div>
      
      {dadosAdmin ? (
        /* TELA SECRETA (ADMIN) - RESTAURADA */
        <div className="card-convite" style={{ maxWidth: '480px', width: '95%', zIndex: 100 }}>
          <h2 style={{ color: '#ff69b4', marginBottom: '5px' }}>Lista de Convidados 📊</h2>
          <p style={{ fontSize: '18px', color: '#ba55d3' }}>Total: <strong>{dadosAdmin.total}</strong></p>
          
          <div style={{ textAlign: 'left', minHeight: '300px', margin: '15px 0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ffb6c1' }}>
                  <th style={{ padding: '8px', color: '#ff69b4', textAlign: 'left' }}>Nome</th>
                  <th style={{ padding: '8px', color: '#ff69b4', textAlign: 'left' }}>Telefone</th>
                  <th style={{ padding: '8px', color: '#ff69b4', textAlign: 'center' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {convidadosPaginados.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{c.nome}</td>
                    <td style={{ padding: '8px', color: '#666' }}>{c.telefone}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <button onClick={() => apagarConvidado(c.telefone, c.nome)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
              <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(p => p - 1)} className="btn-pag">◀</button>
              <span style={{ fontSize: '14px', alignSelf: 'center' }}>{paginaAtual}/{totalPaginas}</span>
              <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(p => p + 1)} className="btn-pag">▶</button>
            </div>
          )}
          
          <button onClick={fecharAdmin} className="botao-magico">Sair do Painel</button>
        </div>
      ) : (
        <>
          <header className="header-principal">
            <h1 className="titulo-rafa">Rafaella</h1>
            <h2 className="subtitulo-rafa">Faz 5 Aninhos! 🎈</h2>
            <p className="frase-chamada">
              "Existem momentos na vida que merecem ser celebrados com quem amamos. 
              Venha deixar meu 5º aniversário ainda mais mágico!" ✨
            </p>
          </header>
          
          <div className="moldura-foto">
            <img src="/foto-rafa.jpg" alt="Rafaella" className="foto-img" />
          </div>
          
          <div className="card-info">
             <div className="info-item">
                <span className="info-icone">📅</span>
                <p>{horarioFesta}</p>
             </div>
             <div className="info-item">
                <span className="info-icone">📍</span>
                <p>{enderecoFesta}</p>
             </div>
          </div>

          <div className="card-convite">
            <p className="txt-confirme">Confirme sua presença aqui: ✨</p>
            
            <input 
              type="text" placeholder={placeholderNome} value={nome} 
              onFocus={() => setPlaceholderNome('')} onBlur={() => setPlaceholderNome('Nome do Convidado')}
              onChange={(e) => setNome(e.target.value)} className="input-custom" 
            />
            
            <input 
              type="tel" placeholder={placeholderTel} value={telefone} 
              onFocus={() => setPlaceholderTel('')} onBlur={() => setPlaceholderTel('DDD + Telefone (só números)')}
              onChange={(e) => setTelefone(e.target.value)} className="input-custom" 
            />
            
            {!exibirMensagem ? (
              <button onClick={confirmar} className="botao-magico">Confirmar Presença! ✨</button>
            ) : (
              <div className="mensagem-sucesso">
                <h2 style={{ color: '#ff69b4', margin: '0', fontSize: '1.2rem' }}>
                  Oba, presença confirmada! 🎂
                </h2>
              </div>
            )}

            <a href={`https://wa.me/${telDanielle}`} target="_blank" rel="noreferrer" className="zap-link-interno">
              <span className="zap-texto">falar com a mamãe da Rafa</span>
              <div className="zap-icone">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
            </a>
          </div>

          <div className="mapa-card">
            <p className="mapa-titulo">Como chegar no meu Reino:</p>
            <div className="mapa-moldura">
              <iframe 
                  title="Mapa da Festa"
                  src={linkGoogleMaps}
                  width="100%" height="180" style={{ border: 0 }} allowFullScreen="" loading="lazy">
              </iframe>
            </div>
          </div>
        </>
      )}

      <footer className="footer-centralizado-papai">Feito com ❤️ pelo Papai da Rafa</footer>

      <style>{`
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; margin: 0; padding: 0; background-color: #fff5f8; }

        .container-principal { min-height: 100vh; width: 100%; display: flex; flex-direction: column; align-items: center; padding: 20px 15px; font-family: "Comic Sans MS", cursive; position: relative; }
        
        .header-principal { text-align: center; margin-bottom: 15px; max-width: 350px; }
        .titulo-rafa { color: #ff69b4; font-size: 3rem; margin: 0; text-shadow: 2px 2px 0px #fff; transform: rotate(-1deg); }
        .subtitulo-rafa { color: #ba55d3; font-size: 1.6rem; margin-top: -5px; font-weight: bold; }
        .frase-chamada { font-size: 13px; color: #db7093; font-style: italic; line-height: 1.4; margin-top: 10px; }

        .moldura-foto { width: 150px; height: 150px; border-radius: 50%; border: 6px solid white; overflow: hidden; margin-bottom: 20px; box-shadow: 0 8px 20px rgba(255, 182, 193, 0.4); }
        .foto-img { width: 100%; height: 100%; object-fit: cover; }
        
        .card-info { background: white; padding: 18px; border-radius: 20px; width: 100%; max-width: 350px; margin-bottom: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.03); border: 1px solid #fff0f5; }
        .info-item { display: flex; align-items: center; margin-bottom: 10px; }
        .info-icone { font-size: 24px; margin-right: 12px; }
        .info-item p { margin: 0; font-size: 14px; color: #db7093; font-weight: bold; text-align: left; line-height: 1.4; }

        .card-convite { background: rgba(255, 255, 255, 0.9); padding: 25px; border-radius: 30px; box-shadow: 0 15px 30px rgba(0,0,0,0.05); width: 100%; max-width: 350px; border: 2px solid #fff0f5; margin-bottom: 20px; text-align: center; }
        .txt-confirme { color: #ff69b4; font-size: 16px; font-weight: bold; margin-bottom: 15px; }
        
        .input-custom { padding: 12px; border-radius: 15px; border: 2px solid #ffe4e1; margin-bottom: 12px; width: 100%; text-align: center; outline: none; font-size: 14px; transition: 0.3s; }
        .input-custom::placeholder { color: rgba(0, 0, 0, 0.25); }
        .input-custom:focus { border-color: #ff69b4; background: #fffafb; }
        
        .botao-magico { background: linear-gradient(135deg, #ffb6c1 0%, #ff69b4 100%); border: none; padding: 16px; border-radius: 15px; color: white; font-weight: bold; width: 100%; font-size: 18px; cursor: pointer; transition: all 0.3s ease; }
        .botao-magico:hover { transform: translateY(-3px) scale(1.02); filter: brightness(1.05); box-shadow: 0 8px 20px rgba(255, 105, 180, 0.4); }

        .btn-pag { padding: 5px 12px; border-radius: 10px; cursor: pointer; border: 1px solid #ffb6c1; background: white; transition: 0.2s; }
        .btn-pag:disabled { opacity: 0.3; cursor: not-allowed; }

        .zap-link-interno { display: flex; align-items: center; justify-content: center; text-decoration: none; margin-top: 10px; }
        .zap-texto { color: #25D366; font-weight: bold; font-size: 12px; margin-right: 8px; }
        .zap-icone { background-color: #25D366; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; justify-content: center; align-items: center; }

        .mapa-card { width: 100%; max-width: 350px; text-align: center; margin-bottom: 20px; }
        .mapa-titulo { color: #db7093; font-weight: bold; font-size: 14px; margin-bottom: 8px; }
        .mapa-moldura { border-radius: 20px; overflow: hidden; border: 4px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.05); height: 180px; }

        .mensagem-sucesso { padding: 15px; background: #fdf5ff; border-radius: 15px; border: 3px dashed #e0b0ff; }
        .footer-centralizado-papai { margin-top: auto; padding: 20px 0; color: #db7093; font-size: 11px; opacity: 0.7; }
        
        .sparkle { position: absolute; font-size: 24px; animation: float 5s infinite ease-in-out; opacity: 0.4; pointer-events: none; }
        .s1 { top: 5%; left: 5%; } .s2 { top: 12%; right: 7%; } .s3 { bottom: 20%; left: 8%; } .s4 { bottom: 10%; right: 6%; }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-20px) rotate(10deg); } }
      `}</style>
    </div>
  );
}

export default App;