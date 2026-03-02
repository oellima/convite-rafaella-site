import React, { useState } from 'react';
import axios from 'axios';

const EstiloGeral = () => (
  <style>{`
    * { box-sizing: border-box; font-style: normal !important; }
    body { 
      margin: 0; padding: 0; 
      background-color: #fff5f8; 
      font-family: sans-serif !important; 
      -webkit-text-size-adjust: 100%;
    }
    .container-principal { 
      display: flex; flex-direction: column; align-items: center; 
      padding: 20px; text-align: center; min-height: 100vh;
    }
    .card-info, .card-convite {
      background: white; padding: 25px; border-radius: 20px;
      width: 100%; max-width: 400px; margin-bottom: 20px;
      box-shadow: 0 8px 20px rgba(255, 182, 193, 0.2);
      border: 1px solid #fff0f5;
    }
    h1 { color: #ff69b4; font-size: 3rem; margin: 10px 0; font-family: cursive; }
    h2 { color: #ba55d3; font-size: 1.6rem; margin-bottom: 20px; }
    p { font-size: 17px; color: #555; line-height: 1.5; font-style: normal !important; }
    
    .moldura-foto { 
      width: 180px; height: 180px; border-radius: 50%; 
      border: 6px solid white; overflow: hidden; 
      margin: 20px auto; box-shadow: 0 10px 25px rgba(255, 182, 193, 0.4);
    }
    .foto-img { width: 100%; height: 100%; object-fit: cover; }

    .input-custom {
      width: 100%; padding: 14px; margin-bottom: 12px;
      border: 2px solid #ffe4e1; border-radius: 12px;
      font-size: 16px; outline: none; text-align: center;
    }
    .botao-magico {
      width: 100%; padding: 18px; border: none;
      background: linear-gradient(135deg, #ffb6c1, #ff69b4);
      color: white; font-weight: bold; font-size: 18px;
      border-radius: 15px; cursor: pointer; transition: 0.3s;
    }
    
    .zap-link { 
      display: inline-block; margin-top: 15px; color: #25D366; 
      text-decoration: none; font-weight: bold; font-size: 14px;
    }
    .mapa-moldura { 
      width: 100%; border-radius: 15px; overflow: hidden; 
      border: 4px solid white; margin-top: 10px; height: 200px;
    }
    .admin-lista { text-align: left; font-size: 14px; width: 100%; }
    .admin-item { border-bottom: 1px solid #eee; padding: 8px 0; display: flex; justify-content: space-between; }
  `}</style>
);

function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [exibirMensagem, setExibirMensagem] = useState(false);
  const [dadosAdmin, setDadosAdmin] = useState(null);

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
    if (!nome.trim() || telefone.length < 8) return alert("Preencha seu nome e telefone!");
    
    try {
      await axios.post('https://convite-rafa-backend.onrender.com/confirmar', { nome, telefone });
      setExibirMensagem(true);
      const msg = `Olá! Confirmei presença no aniversário da Rafaella! 🎂%0AConvidado: ${nome}`;
      window.open(`https://wa.me/${telDanielle}?text=${msg}`, '_blank');
    } catch (e) { alert("Erro ao confirmar presença."); }
  };

  return (
    <div className="container-principal">
      <EstiloGeral />
      
      {dadosAdmin ? (
        <div className="card-convite">
          <h2>Lista de Convidados 📊</h2>
          <p>Total: <strong>{dadosAdmin.total}</strong></p>
          <div className="admin-lista">
            {dadosAdmin.convidados?.map((c, i) => (
              <div key={i} className="admin-item">
                <span>{c.nome}</span>
                <span style={{color: '#888'}}>{c.telefone}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setDadosAdmin(null)} className="botao-magico" style={{marginTop: '20px'}}>Sair do Painel</button>
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
            <p>📅 <strong>{horarioFesta}</strong></p>
            <p>📍 {enderecoFesta}</p>
          </div>

          <div className="card-convite">
            <p style={{color: '#ff69b4', fontWeight: 'bold', marginBottom: '15px'}}>Confirme sua presença: ✨</p>
            <input className="input-custom" placeholder="Nome do Convidado" value={nome} onChange={e => setNome(e.target.value)} />
            <input className="input-custom" placeholder="WhatsApp com DDD" type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} />
            
            {!exibirMensagem ? (
              <button onClick={confirmar} className="botao-magico">Confirmar Presença! 🎂</button>
            ) : (
              <div style={{background: '#fdf5ff', padding: '15px', borderRadius: '10px', border: '2px dashed #ffb6c1'}}>
                <p style={{color: '#ff69b4', margin: 0, fontWeight: 'bold'}}>Oba! Presença confirmada! 💖</p>
              </div>
            )}
            
            <a href={`https://wa.me/${telDanielle}`} target="_blank" rel="noreferrer" className="zap-link">Falar com a mamãe da Rafa 🟢</a>
          </div>

          <div className="card-info" style={{padding: '10px'}}>
            <p style={{fontSize: '14px', marginBottom: '10px'}}>Localização:</p>
            <div className="mapa-moldura">
              <iframe title="mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.327595632163!2d-34.8436417!3d-7.1065261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ace81036329063%3A0x6b77299a9d20f666!2sR.%20Bacharel%20Irenaldo%20de%20Albuquerque%20Chaves%2C%20201%20-%20Aeroclube%2C%20Jo%C3%A3o%20Pessoa%20-%20PB%2C%2058036-460!5e0!3m2!1spt-BR!2sbr!4v1700000000000" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
            </div>
          </div>
        </>
      )}
      <footer style={{marginTop: '30px', paddingBottom: '20px'}}>
        <p style={{fontSize: '12px', opacity: 0.7}}>Feito com ❤️ pelo Papai da Rafa</p>
      </footer>
    </div>
  );
}

export default App;
