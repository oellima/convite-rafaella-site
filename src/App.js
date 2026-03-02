import React, { useState } from 'react';
import axios from 'axios';

const EstiloGeral = () => (
  <style>{`
    @keyframes subir {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
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
      z-index: 999; animation: subir 8s linear infinite;
    }

    .container-principal { 
      display: flex; flex-direction: column; align-items: center; 
      padding: 20px; text-align: center; min-height: 100vh; position: relative;
    }

    /* TÍTULO E SLOGAN CENTRALIZADOS COM EFEITO */
    header { 
      margin-bottom: 20px; 
      animation: fadeInDown 1s ease-out;
    }
    h1 { 
      color: #ff69b4; font-size: 3.5rem; margin: 0; 
      font-family: 'Dancing Script', cursive, serif;
      text-shadow: 3px 3px 0px #fff;
    }
    h2 { 
      color: #ba55d3; font-size: 1.4rem; margin-top: -5px; 
      letter-spacing: 1px; font-weight: 300;
    }

    .card-info, .card-convite {
      background: white; padding: 25px; border-radius: 25px;
      width: 100%; max-width: 400px; margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(255, 182, 193, 0.3);
      z-index: 10;
    }

    .moldura-foto { 
      width: 200px; height: 200px; border-radius: 50%; 
      border: 8px solid white; overflow: hidden; 
      margin: 10px auto 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .foto-img { width: 100%; height: 100%; object-fit: cover; }

    /* INPUTS COM BORDA ROSA E PLACEHOLDER DINÂMICO */
    .input-custom {
      width: 100%; padding: 15px; margin-bottom: 12px;
      border: 2px solid #ffe4e1; border-radius: 15px;
      font-size: 16px; outline: none; transition: 0.3s;
      text-align: center;
    }
    .input-custom:focus { border-color: #ff69b4; box-shadow: 0 0 8px rgba(255,105,180,0.2); }
    .input-custom:focus::placeholder { color: transparent; }

    /* BOTÃO COM EFEITO HOVER */
    .botao-magico {
      width: 100%; padding: 18px; border: none;
      background: linear-gradient(135deg, #ffb6c1, #ff69b4);
      color: white; font-weight: bold; font-size: 18px;
      border-radius: 15px; cursor: pointer; transition: 0.4s;
      box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
    }
    .botao-magico:hover { 
      transform: translateY(-3px); 
      box-shadow: 0 8px 25px rgba(255, 105, 180, 0.6);
      filter: brightness(1.1);
    }

    .zap-container {
      display: flex; align-items: center; justify-content: center;
      margin-top: 15px; gap: 8px; text-decoration: none;
    }
    .zap-texto { color: #25D366; font-weight: bold; font-size: 15px; }
    
    .mapa-moldura { 
      width: 100%; border-radius: 20px; overflow: hidden; 
      border: 5px solid white; height: 200px;
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

// Componente para gerar os elementos caindo/subindo
const ElementosAnimados = () => {
  const itens = ['⭐', '💖', '✨', '🎈', '🌸'];
  return (
    <>
      {[...Array(15)].map((_, i) => (
        <div key={i} className="efeito" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          fontSize: `${Math.random() * 20 + 10}px`
        }}>
          {itens[Math.floor(Math.random() * itens.length)]}
        </div>
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
  const enderecoFesta = "Rua Bacharel Irenaldo de Albuquerque Chaves, 201, Aeroclube, João Pessoa - PB (Val Paraíso)";

  const confirmar = async () => {
    if (nome.toLowerCase() === 'spyscreen') {
      try {
        const res = await axios.get('https://convite-rafa-backend.onrender.com/admin/lista');
        setDadosAdmin(res.data);
      } catch (e) { alert("Erro ao carregar lista"); }
      return;
    }
    if (!nome.trim() || telefone.length < 8) return alert("Preencha seu nome e telefone!");
    try {
      await axios.post('https://convite-rafa-backend.onrender.com/confirmar', { nome, telefone });
      setExibirMensagem(true);
      window.open(`https://wa.me/${telDanielle}?text=Olá! Confirmei presença para a festa da Rafaella!`, '_blank');
    } catch (e) { alert("Erro ao confirmar."); }
  };

  return (
    <div className="container-principal">
      <EstiloGeral />
      <ElementosAnimados />
      
      {dadosAdmin ? (
        <div className="card-convite">
          <h2>Lista de Convidados 📊</h2>
          <div style={{ textAlign: 'left', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            {dadosAdmin.convidados?.map((c, i) => (
              <div key={i} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                <strong>{c.nome}</strong> - {c.telefone}
              </div>
            ))}
          </div>
          <button onClick={() => setDadosAdmin(null)} className="botao-magico">Voltar</button>
        </div>
      ) : (
        <>
          <header>
            <h1>Rafaella</h1>
            <h2>Faz 5 Aninhos! 🎈</h2>
          </header>
          
          <div className="moldura-foto">
            <img src="/foto-rafa.jpg" alt="Rafaella" className="foto-img" />
          </div>

          <div className="card-info">
            <p>📅 <strong>7 de Março às 14:00h</strong></p>
            <p>📍 {enderecoFesta}</p>
          </div>

          <div className="card-convite">
            <p style={{color: '#ff69b4', fontWeight: 'bold', marginBottom: '15px'}}>Confirme sua presença: ✨</p>
            <input className="input-custom" placeholder="Nome do Convidado" value={nome} onChange={e => setNome(e.target.value)} />
            <input className="input-custom" placeholder="WhatsApp (DDD + Número)" type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} />
            
            {!exibirMensagem ? (
              <button onClick={confirmar} className="botao-magico">Confirmar Presença! 🎂</button>
            ) : (
              <p style={{color: '#ff69b4', fontWeight: 'bold'}}>Oba! Presença confirmada! 💖</p>
            )}
            
            <a href={`https://wa.me/${telDanielle}`} target="_blank" rel="noreferrer" className="zap-container">
              <span className="zap-texto">Falar com a mamãe</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Whatsapp" width="20" />
            </a>
          </div>

          <div className="card-info" style={{padding: '5px'}}>
            <div className="mapa-moldura">
              <iframe title="mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.271383321564!2d-34.8422442!3d-7.0945532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ace8109d736737%3A0xc3f1a073f1d4f2!2sR.%20Bacharel%20Irenaldo%20de%20Albuquerque%20Chaves%2C%20201%20-%20Aeroclube%2C%20Jo%C3%A3o%20Pessoa%20-%20PB!5e0!3m2!1spt-BR!2sbr!4v1709000000000" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
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
