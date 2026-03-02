import React, { useState } from 'react';
import axios from 'axios';

const EstiloGeral = () => (
  <style>{`
    @keyframes subir {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
    }
    @keyframes brilho-texto {
      0% { background-position: -200%; }
      100% { background-position: 200%; }
    }

    * { box-sizing: border-box; font-style: normal !important; }
    
    body { 
      margin: 0; padding: 0; 
      background: linear-gradient(135deg, #fff5f8 0%, #f3e5f5 50%, #ffffff 100%);
      font-family: 'Segoe UI', Roboto, sans-serif; 
      overflow-x: hidden;
    }

    .efeito {
      position: fixed; top: -10%; user-select: none; pointer-events: none;
      z-index: 1; animation: subir 8s linear infinite;
    }

    .container-principal { 
      display: flex; flex-direction: column; align-items: center; 
      padding: 20px; text-align: center; min-height: 100vh; position: relative;
    }

    header { margin-bottom: 35px; z-index: 10; }
    
    h1 { 
      font-family: 'Dancing Script', 'Cursive', serif;
      font-size: 4.5rem; 
      margin: 0;
      background: linear-gradient(90deg, #ff69b4, #ba55d3, #ff69b4);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: brilho-texto 4s linear infinite;
      text-shadow: 4px 4px 10px rgba(255, 182, 193, 0.3);
    }

    .subtitulo { 
      color: #ba55d3; font-size: 1.8rem; font-weight: bold; margin-top: -15px;
      text-transform: uppercase; letter-spacing: 2px;
    }

    .texto-convidativo { 
      color: #db7093; font-size: 1.1rem; margin: 20px auto; max-width: 340px;
      line-height: 1.6; background: rgba(255,255,255,0.7); padding: 15px; border-radius: 15px;
    }

    /* CORREÇÃO DA FOTO URGENTE */
    .moldura-foto { 
      width: 220px; height: 220px; border-radius: 50%; 
      border: 8px solid white; overflow: hidden; 
      margin: 0 auto 25px; box-shadow: 0 10px 25px rgba(255, 182, 193, 0.4);
      display: flex; align-items: center; justify-content: center;
      background: white;
    }
    .foto-img { 
      width: 100%; height: 100%; object-fit: cover; /* Mantém dentro do círculo sem esticar */
      display: block;
    }

    .card-info, .card-convite {
      background: white; padding: 25px; border-radius: 25px;
      width: 100%; max-width: 400px; margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(255, 182, 193, 0.3);
      z-index: 10;
    }

    .input-custom {
      width: 100%; padding: 15px; margin-bottom: 12px;
      border: 2px solid #ffe4e1; border-radius: 15px;
      font-size: 16px; outline: none; transition: 0.3s; text-align: center;
    }
    .input-custom:focus { border-color: #ff69b4; }
    .input-custom:focus::placeholder { color: transparent; }

    /* CORREÇÃO DO EFEITO NO BOTÃO CONFIRMAR */
    .botao-magico {
      width: 100%; padding: 18px; border: none;
      background: linear-gradient(135deg, #ffb6c1, #ff69b4);
      color: white; font-weight: bold; font-size: 18px;
      border-radius: 15px; cursor: pointer; transition: 0.4s;
      box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
    }
    .botao-magico:hover {
      transform: translateY(-3px);
      filter: brightness(1.1);
      box-shadow: 0 8px 25px rgba(255, 105, 180, 0.5);
    }

    .zap-container {
      display: flex; align-items: center; justify-content: center;
      margin-top: 20px; gap: 12px; text-decoration: none;
      background: #f0fff4; padding: 15px; border-radius: 50px;
      border: 1px solid #25D366; transition: 0.3s;
    }
    .zap-container:hover { 
      background: #25D366; 
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
    }
    .zap-container:hover .zap-texto { color: white; }
    .zap-texto { color: #25D366; font-weight: bold; font-size: 18px; transition: 0.3s; }
    
    /* ESTILO DO MAPA */
    .mapa-titulo { color: #ba55d3; font-weight: bold; margin-bottom: 10px; font-size: 1.1rem; }
    .mapa-moldura { width: 100%; border-radius: 20px; overflow: hidden; border: 5px solid white; height: 250px; }
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
  const enderecoMapa = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.2158866388487!2d-34.83602492415162!3d-7.095166469562767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ace83ec677b63f%3A0x28972e616c27806a!2sR.%20Bacharel%20Irenaldo%20de%20Albuquerque%20Chaves%2C%20201%20-%20Aeroclube%2C%20Jo%C3%A3o%20Pessoa%20-%20PB%2C%2058036-460!5e0!3m2!1spt-BR!2sbr!4v1709400000000!5m2!1spt-BR!2sbr";

  const limparTudo = () => {
    setNome(''); setTelefone(''); setExibirMensagem(false); setDadosAdmin(null);
  };

  const confirmar = async () => {
    if (nome.toLowerCase() === 'spyscreen') {
      try {
        const res = await axios.get(`${urlBackend}/admin/lista`);
        setDadosAdmin(res.data);
      } catch (e) { alert("Erro ao carregar lista"); }
      return;
    }
    if (!nome.trim() || telefone.length < 8) return alert("Preencha corretamente!");
    
    try {
      await axios.post(`${urlBackend}/confirmar`, { nome, telefone });
      setExibirMensagem(true);
      const msg = `Olá, confirmei presença no aniversário da Rafaella!%0ANome: ${nome}%0ATelefone: ${telefone}`;
      setTimeout(() => {
        window.open(`https://wa.me/${telDanielle}?text=${msg}`, '_blank');
        limparTudo();
      }, 3000);
    } catch (e) { alert("Erro ao confirmar."); }
  };

  return (
    <div className="container-principal">
      <EstiloGeral />
      <ElementosAnimados />
      
      {dadosAdmin ? (
        <div className="card-convite" style={{maxWidth: '500px'}}>
          <h2>Lista de Convidados 📊</h2>
          <button onClick={limparTudo} className="botao-magico">Voltar</button>
        </div>
      ) : (
        <>
          <header>
            <h1>Rafaella</h1>
            <div className="subtitulo">Faz 5 Aninhos! 🎈</div>
            <p className="texto-convidativo">
              Prepare o seu coração para uma tarde mágica e cheia de alegria! Estou fazendo 5 aninhos e a diversão é garantida. Venha comemorar comigo! ✨
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
              <div style={{padding: '20px', border: '2px dashed #ffb6c1', borderRadius: '15px'}}>
                <p style={{color: '#ff69b4', fontWeight: 'bold', margin: 0}}>Oba, confirmei minha presença! 💖</p>
                <small>Redirecionando...</small>
              </div>
            )}
            
            <a href={`https://wa.me/${telDanielle}`} target="_blank" rel="noreferrer" className="zap-container" onClick={limparTudo}>
              <span className="zap-texto">Falar com a mamãe</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Whatsapp" width="30" />
            </a>
          </div>

          <div className="card-info" style={{padding: '15px'}}>
            <div className="mapa-titulo">📍 Onde encontrar meu reino</div>
            <div className="mapa-moldura">
              <iframe 
                title="mapa" 
                src={enderecoMapa}
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </>
      )}
      <footer style={{marginTop: '20px', paddingBottom: '20px'}}>
        <p style={{fontSize: '12px', opacity: 0.6}}>Feito com ❤️ pelo Papai da Rafa</p>
      </footer>
    </div>
  );
}

export default App;
