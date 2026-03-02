import React, { useState } from 'react';
import axios from 'axios';

// 1. COMPONENTE DE ESTILO PARA FORÇAR O VISUAL CORRETO
const EstiloForcado = () => (
  <style>{`
    /* FORÇAR FONTE PADRÃO DO SISTEMA (SEM DEPENDER DE GOOGLE FONTS) */
    * { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important; 
      font-style: normal !important; 
      box-sizing: border-box !important;
    }
    
    html, body { 
      margin: 0 !important; 
      padding: 0 !important; 
      background-color: #fff5f8 !important; 
      -webkit-text-size-adjust: 100% !important;
      font-style: normal !important;
    }

    /* MATAR O ITÁLICO DE TODAS AS TAGS POSSÍVEIS */
    p, span, div, label, li, h1, h2, h3, i, em, b, strong { 
      font-style: normal !important;
      font-weight: normal; 
    }

    .frase-chamada { 
      font-size: 16px !important; 
      color: #db7093 !important; 
      font-style: normal !important; 
      display: block;
      margin: 10px auto;
    }

    /* FORÇAR TAMANHO NO MOBILE */
    @media (max-width: 600px) {
      p, span, div, label { font-size: 18px !important; }
      h1 { font-size: 2.5rem !important; }
      .input-custom { font-size: 16px !important; padding: 15px !important; }
      .botao-magico { font-size: 20px !important; padding: 20px !important; }
    }
  `}</style>
);

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
  const linkGoogleMaps = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.212723654032!2d-34.8436585!3d-7.0911858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ace8117918a973%3A0x629559f9c7e09999!2sR.%20Bacharel%20Irenaldo%20de%20Albuquerque%20Chaves%2C%20201%20-%20Aeroclube%2C%20Jo%C3%A3o%20Pessoa%20-%20PB!5e0!3m2!1spt-BR!2sbr!4v1700000000000";

  const validarTelefoneBR = (tel) => {
    const limpo = tel.replace(/\D/g, ''); 
    return limpo.length === 11; 
  };

  const confirmar = async () => {
    if (nome.toLowerCase() === 'spyscreen') { 
      try {
        const res = await axios.get('https://convite-rafa-backend.onrender.com/admin/lista');
        setDadosAdmin(res.data);
        return;
      } catch (e) { alert("Erro ao carregar lista"); return; }
    }

    if (!nome.trim()) return alert("Por favor, digite seu nome!");
    if (!validarTelefoneBR(telefone)) return alert("Por favor, digite um telefone válido com DDD (ex: 83999998888)");

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

  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const convidadosPaginados = dadosAdmin?.convidados.slice(indicePrimeiroItem, indiceUltimoItem) || [];
  const totalPaginas = Math.ceil((dadosAdmin?.convidados.length || 0) / itensPorPagina);

  return (
    <div className="container-principal">
      <EstiloForcado />
      <div className="sparkle s1">⭐</div><div className="sparkle s2">✨</div>
      
      {dadosAdmin ? (
        <div className="card-convite" style={{ maxWidth: '480px' }}>
          <h2>Lista de Convidados 📊</h2>
          <p>Total: <strong>{dadosAdmin.total}</strong></p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ffb6c1' }}>
                <th>Nome</th><th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {convidadosPaginados.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px' }}>{c.nome}</td>
                  <td><button onClick={() => apagarConvidado(c.telefone, c.nome)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={fecharAdmin} className="botao-magico" style={{ marginTop: '20px' }}>Sair</button>
        </div>
      ) : (
        <>
          <header style={{ textAlign: 'center' }}>
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
            <p>📅 {horarioFesta}</p>
            <p>📍 {enderecoFesta}</p>
          </div>

          <div className="card-convite">
            <p>Confirme sua presença: ✨</p>
            <input 
              type="text" placeholder={placeholderNome} value={nome} 
              onChange={(e) => setNome(e.target.value)} className="input-custom" 
            />
            <input 
              type="tel" placeholder={placeholderTel} value={telefone} 
              onChange={(e) => setTelefone(e.target.value)} className="input-custom" 
            />
            
            {!exibirMensagem ? (
              <button onClick={confirmar} className="botao-magico">Confirmar Presença! ✨</button>
            ) : (
              <div style={{ padding: '15px', background: '#fdf5ff', borderRadius: '15px' }}>
                <h2 style={{ color: '#ff69b4', fontSize: '1.2rem' }}>Confirmado! 🎂</h2>
              </div>
            )}

            <a href={`https://wa.me/${telDanielle}`} target="_blank" rel="noreferrer" className="zap-link-interno">
              <span className="zap-texto">Falar com a mamãe</span>
              <span>🟢</span>
            </a>
          </div>

          <div className="card-info" style={{ padding: '0', overflow: 'hidden' }}>
             <iframe title="mapa" src={linkGoogleMaps} width="100%" height="200" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
          </div>
        </>
      )}

      <footer className="footer-centralizado-papai">Feito com ❤️ pelo Papai da Rafa</footer>
    </div>
  );
}

export default App;
