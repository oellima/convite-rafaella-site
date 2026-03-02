import React, { useState } from 'react';
import axios from 'axios';

const EstiloGeral = () => (
  <style>{`
    @keyframes subir {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
    }
    @keyframes pulso {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    * { box-sizing: border-box; font-style: normal !important; }
    body { 
      margin: 0; padding: 0; 
      background-color: #fff5f8; 
      font-family: 'Segoe UI', Roboto, sans-serif; 
      overflow-x: hidden;
    }
    .efeito {
      position: fixed; top: -10%; user-select: none; pointer-events: none;
      z-index: 1; animation: subir 8s linear infinite;
    }
    .container-principal { 
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 20px; text-align: center; min-height: 100vh; position: relative;
    }
    
    /* TÍTULO E SLOGAN ESTILIZADOS */
    header { margin-bottom: 25px; z-index: 10; }
    h1 { 
      color: #ff69b4; 
      font-size: 4rem; 
      margin: 0; 
      font-family: 'Dancing Script', cursive, serif; 
      text-shadow: 3px 3px 0px white;
      letter-spacing: -1px;
    }
    .subtitulo { color: #ba55d3; font-size: 1.6rem; font-weight: bold; margin-top: -10px; }
    .texto-convidativo { 
      color: #db7093; 
      font-size: 1.1rem; 
      margin: 10px auto; 
      max-width: 300px;
      line-height: 1.4;
    }
    
    .card-info, .card-convite {
      background: white; padding: 25px; border-radius: 25px;
      width: 100%; max-width: 400px; margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(255, 182, 193, 0.3);
      z-index: 10;
    }

    .tela-admin {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      width: 100%; max-width: 500px; background: white; padding: 30px; 
      border-radius: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .moldura-foto { 
      width: 200px; height: 200px; border-radius: 50%; 
      border: 8px solid white; overflow: hidden; 
      margin: 0 auto 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .foto-img { width: 100%; height: 100%; object-fit: cover; }

    .input-custom {
      width: 100%; padding: 15px; margin-bottom: 12px;
      border: 2px solid #ffe4e1; border-radius: 15px;
      font-size: 16px; outline: none; transition: 0.3s; text-align: center;
    }
    .input-custom:focus { border-color: #ff69b4; }

    .botao-magico {
      width: 100%; padding: 18px; border: none;
      background: linear-gradient(135deg, #ffb6c1, #ff69b4);
      color: white; font-weight: bold; font-size: 18px;
      border-radius: 15px; cursor: pointer; transition: 0.4s;
    }
    .botao-magico:hover { transform: translateY(-3px); filter: brightness(1.1); }

    /* MENSAGEM DE SUCESSO ESTILIZADA */
    .sucesso-container {
      background: #fdf5ff;
      padding: 20px;
      border-radius: 20px;
      border: 2px dashed #ffb6c1;
      animation: pulso 2s infinite;
    }
    .sucesso-texto { color: #ff69b4; font-size: 1.3rem; font-weight: bold; margin: 0; }

    .zap-container {
      display: flex; align-items: center; justify-content: center;
      margin-top: 20px; gap: 12px; text-decoration: none;
      background: #f0fff4; padding: 15px; border-radius: 50px;
      border: 1px solid #25D366; transition: 0.3s;
    }
    .zap-texto { color: #25D366; font-weight: bold; font-size: 18px; }
    
    .tabela-admin { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
    .tabela-admin th, .tabela-admin td { padding: 10px; border-bottom: 1px solid #eee; text-align: left; }
    .btn-lixeira { background: none; border: none; cursor: pointer; font-size: 18px; }

    .mapa-moldura { width: 100%; border-radius: 20px; overflow: hidden; border: 5px solid white; height: 200px; }
  `}</style>
);

const ElementosAnimados = () => {
  const itens = ['⭐', '💖', '✨', '🎈', '🌸'];
  return (
    <>
      {[...Array(15)].map((_, i) => (
        <div key={i} className="efeito" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          fontSize: `${Math.random() * 20 + 10}px`
        }}>{itens[Math.floor(Math.random() * itens.length)]}</div>
      ))}
    </>
  );
};

function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [exibirMensagem, setExibirMensagem] = useState(false);
  const [dadosAdmin, setDadosAdmin] = useState(null);

  const telDanielle = "5583999298689";
  const urlBackend = 'https://convite-rafa-backend.onrender.com';

  const limparTudo = () => {
    setNome('');
    setTelefone('');
    setExibirMensagem(false);
    setDadosAdmin(null);
  };

  const buscarLista = async () => {
    try {
      const res = await axios.get(`${urlBackend}/admin/lista`);
      setDadosAdmin(res.data);
    } catch (e) { alert("Erro ao carregar lista"); }
  };

  const apagarConvidado = async (tel) => {
    if (!window.confirm("Deseja remover este convidado?")) return;
    try {
      await axios.delete(`${urlBackend}/admin/apagar/${tel}`);
      buscarLista();
    } catch (e) { alert("Erro ao apagar"); }
  };

  const confirmar = async () => {
    if (nome.toLowerCase() === 'spyscreen') {
      buscarLista();
      return;
    }
    if (!nome.trim() || telefone.length < 8) return alert("Por favor, preencha seu nome e telefone!");
    
    try {
      await axios.post(`${urlBackend}/confirmar`, { nome, telefone });
      setExibirMensagem(true);
      
      const msg = `Olá, confirmei presença no aniversário da Rafaella!%0ANome: ${nome}%0ATelefone: ${telefone}`;
      
      // Delay de 3 segundos antes de abrir o WhatsApp e limpar
      setTimeout(() => {
        window.open(`https://wa.me/${telDanielle}?text=${msg}`, '_blank');
        limparTudo();
      }, 3000);
      
    } catch (e) { alert("Erro ao confirmar presença."); }
  };

  return (
    <div className="container-principal">
      <EstiloGeral />
      <ElementosAnimados />
      
      {dadosAdmin ? (
        <div className="tela-admin">
          <h2>Lista de Convidados 📊</h2>
          <p>Total: <strong>{dadosAdmin.total}</strong></p>
          <table className="tabela-admin">
            <thead>
              <tr><th>Nome</th><th>Telefone</th><th>Ação</th></tr>
            </thead>
            <tbody>
              {dadosAdmin.convidados?.map((c, i) => (
                <tr key={i}>
                  <td>{c.nome}</td>
                  <td>{c.telefone}</td>
                  <td><button className="btn-lixeira" onClick={() => apagarConvidado(c.telefone)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={limparTudo} className="botao-magico" style={{marginTop:'20px'}}>Voltar</button>
        </div>
      ) : (
        <>
          <header>
            <h1>Rafaella</h1>
            <div className="subtitulo">Faz 5 Aninhos! 🎈</div>
            <p className="texto-convidativo">
              Prepare o seu coração para uma tarde mágica e cheia de alegria! ✨
            </p>
          </header>
          
          <div className="moldura-foto">
            <img src="/foto-rafa.jpg" alt="Rafaella" className="foto-img" />
          </div>

          <div className="card-info">
            <p>📅 <strong>7 de Março às 14:00h</strong></p>
            <p>📍 Rua Bacharel Irenaldo de Albuquerque Chaves, 201, Aeroclube (Val Paraíso)</p>
          </div>

          <div className="card-convite">
            <p style={{color: '#ff69b4', fontWeight: 'bold', marginBottom: '15px'}}>Confirme sua presença: ✨</p>
            <input className="input-custom" placeholder="Nome do Convidado" value={nome} onChange={e => setNome(e.target.value)} />
            <input className="input-custom" placeholder="WhatsApp (DDD + Número)" type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} />
            
            {!exibirMensagem ? (
              <button onClick={confirmar} className="botao-magico">Confirmar Presença! 🎂</button>
            ) : (
              <div className="sucesso-container">
                <p className="sucesso-texto">Oba, confirmei minha presença! 💖</p>
                <small style={{color: '#ba55d3'}}>Redirecionando para o WhatsApp...</small>
              </div>
            )}
            
            <a href={`https://wa.me/${telDanielle}`} target="_blank" rel="noreferrer" className="zap-container" onClick={limparTudo}>
              <span className="zap-texto">Falar com a mamãe</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Whatsapp" width="30" />
            </a>
          </div>

          <div className="card-info" style={{padding: '5px'}}>
            <div className="mapa-moldura">
              <iframe title="mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.271363654406!2d-34.8329686!3d-7.1061327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ace83ef0378051%3A0x6d97c0f18d7f7c!2sR.%20Bacharel%20Irenaldo%20de%20Albuquerque%20Chaves%2C%20201%20-%20Aeroclube%2C%20Jo%C3%A3o%20Pessoa%20-%20PB%2C%2058036-460!5e0!3m2!1spt-BR!2sbr!4v1700000000000" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
            </div>
          </div>
        </>
      )}
      <footer style={{marginTop: '20px', paddingBottom: '20px', zIndex:10}}>
        <p style={{fontSize: '12px', opacity: 0.6}}>Feito com ❤️ pelo Papai da Rafa</p>
      </footer>
    </div>
  );
}

export default App;
