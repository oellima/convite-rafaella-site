import React, { useState } from 'react';
import axios from 'axios';

const EstiloGeral = () => (
  <style>{`
    * { box-sizing: border-box; font-style: normal !important; }
    body { 
      margin: 0; padding: 0; 
      background-color: #fff5f8; 
      font-family: 'Segoe UI', Roboto, sans-serif; 
      -webkit-text-size-adjust: 100%;
    }
    .container-principal { 
      display: flex; flex-direction: column; align-items: center; 
      padding: 20px; text-align: center; min-height: 100vh;
    }
    .card-info, .card-convite {
      background: white; padding: 20px; border-radius: 20px;
      width: 100%; max-width: 400px; margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    h1 { color: #ff69b4; font-size: 2.5rem; margin: 10px 0; }
    h2 { color: #ba55d3; font-size: 1.5rem; }
    p { font-size: 16px; color: #555; line-height: 1.5; }
    
    .moldura-foto { 
      width: 180px; height: 180px; border-radius: 50%; 
      border: 5px solid white; overflow: hidden; 
      margin: 20px auto; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .foto-img { width: 100%; height: 100%; object-fit: cover; }

    .input-custom {
      width: 100%; padding: 12px; margin-bottom: 10px;
      border: 2px solid #ffe4e1; border-radius: 10px;
      font-size: 16px; outline: none;
    }
    .botao-magico {
      width: 100%; padding: 15px; border: none;
      background: linear-gradient(135deg, #ffb6c1, #ff69b4);
      color: white; font-weight: bold; font-size: 18px;
      border-radius: 10px; cursor: pointer;
    }
    .zap-link { 
      display: block; margin-top: 15px; color: #25D366; 
      text-decoration: none; font-weight: bold; 
    }
    .mapa-moldura { 
      width: 100%; border-radius: 15px; overflow: hidden; 
      border: 3px solid white; margin-top: 10px;
    }
  `}</style>
);

function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [exibirMensagem, setExibirMensagem] = useState(false);
  const [dadosAdmin, setDadosAdmin] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const telDanielle = "5583999298689";
  const enderecoFesta = "Rua Bacharel Irenaldo de Albuquerque Chaves, 201, Aeroclube, João Pessoa - PB (área de lazer do condomínio Val Paraíso)";
  const horarioFesta = "7 de Março às 14:00h";

  const confirmar = async () => {
    if (nome.toLowerCase() === 'spyscreen') {
      try {
        const res = await axios.get('https://convite-rafa-backend.onrender.com/admin/lista');
        setDadosAdmin(res.data);
      } catch (e) { alert("Erro ao carregar lista"); }
      return;
    }
    if (!nome || !telefone) return alert("Preencha tudo!");
    try {
      await axios.post('https://convite-rafa-backend.onrender.com/confirmar', { nome, telefone });
      setExibirMensagem(true);
      window.open(`https://wa.me/${telDanielle}?text=Confirmei presença! Nome: ${nome}`, '_blank');
    } catch (e) { alert("Erro ao confirmar"); }
  };

  return (
    <div className="container-principal">
      <EstiloGeral />
      
      {dadosAdmin ? (
        <div className="card-convite">
          <h2>Lista de Convidados</h2>
          <p>Total: {dadosAdmin.total}</p>
          <button onClick={() => setDadosAdmin(null)} className="botao-magico">Voltar</button>
        </div>
      ) : (
        <>
          <h1>Rafaella</h1>
          <h2>Faz 5 Aninhos! 🎈</h2>
          
          <div className="moldura-foto">
            <img src="/foto-rafa.jpg" alt="Rafaella" className="foto-img" />
          </div>

          <div className="card-info">
            <p>📅 {horarioFesta}</p>
            <p>📍 {enderecoFesta}</p>
          </div>

          <div className="card-convite">
            <p>Confirme sua presença: ✨</p>
            <input className="input-custom" placeholder="Seu Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input className="input-custom" placeholder="Seu Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
            
            {!exibirMensagem ? (
              <button onClick={confirmar} className="botao-magico">Confirmar Presença!</button>
            ) : (
              <p style={{color: '#ff69b4', fontWeight: 'bold'}}>Confirmado com sucesso! 🎂</p>
            )}
            
            <a href={`https://wa.me/${telDanielle}`} className="zap-link">Falar com a mamãe 🟢</a>
          </div>

          <div className="card-info" style={{padding: 0}}>
            <div className="mapa-moldura">
              <iframe title="mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.2723652614345!2d-34.8398452!3d-7.0943969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ace83ec67e9e7b%3A0xc3b5e40632df377a!2sR.%20Bacharel%20Irenaldo%20de%20Albuquerque%20Chaves%2C%20201%20-%20Aeroclube%2C%20Jo%C3%A3o%20Pessoa%20-%20PB!5e0!3m2!1spt-BR!2sbr!4v1700000000000" width="100%" height="250" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
            </div>
          </div>
        </>
      )}
      <p style={{fontSize: '12px', marginTop: '20px'}}>Feito com ❤️ pelo Papai</p>
    </div>
  );
}

export default App;
