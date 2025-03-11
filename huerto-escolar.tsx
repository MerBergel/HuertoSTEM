import React, { useState } from 'react';

const HuertoEscolar = () => {
  // Estados del juego
  const [etapaActual, setEtapaActual] = useState('inicio');
  const [planta, setPlanta] = useState(null);
  const [diasCrecimiento, setDiasCrecimiento] = useState(0);
  const [aguaRecibida, setAguaRecibida] = useState(0);
  const [tierraPreparada, setTierraPreparada] = useState(false);
  const [hayPlaga, setHayPlaga] = useState(false);
  const [plagaTratada, setPlagaTratada] = useState(false);
  const [salud, setSalud] = useState(100);
  const [mensaje, setMensaje] = useState('¡Bienvenido al huerto escolar! Primero debemos preparar la tierra.');
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [resultadoFinal, setResultadoFinal] = useState('');

  // Información sobre las plantas
  const plantas = {
    lechuga: {
      nombre: 'Lechuga',
      diasParaCrecer: 5,
      aguaNecesaria: 3,
      imagenSemilla: '🌱',
      imagenCreciendo: '🥬',
      imagenFinal: '🥗'
    },
    tomate: {
      nombre: 'Tomate',
      diasParaCrecer: 7,
      aguaNecesaria: 5,
      imagenSemilla: '🌱',
      imagenCreciendo: '🌿',
      imagenFinal: '🍅'
    },
    zanahoria: {
      nombre: 'Zanahoria',
      diasParaCrecer: 6,
      aguaNecesaria: 4,
      imagenSemilla: '🌱',
      imagenCreciendo: '🌿',
      imagenFinal: '🥕'
    }
  };

  // Función para preparar la tierra
  const prepararTierra = () => {
    setTierraPreparada(true);
    setMensaje('¡Muy bien! Has preparado la tierra. Ahora elige qué quieres plantar.');
    setEtapaActual('elegirPlanta');
  };

  // Función para elegir planta
  const elegirPlanta = (tipoPlanta) => {
    setPlanta(tipoPlanta);
    setMensaje(`¡Has plantado ${plantas[tipoPlanta].nombre}! Ahora debes regarla regularmente.`);
    setEtapaActual('cuidado');
  };

  // Función para regar
  const regar = () => {
    if (aguaRecibida < plantas[planta].aguaNecesaria) {
      setAguaRecibida(aguaRecibida + 1);
      setSalud(Math.min(100, salud + 10));
      setMensaje(`Has regado tu ${plantas[planta].nombre}. Agua recibida: ${aguaRecibida + 1}/${plantas[planta].aguaNecesaria}`);
    } else {
      setSalud(Math.max(0, salud - 10));
      setMensaje(`¡Cuidado! Estás regando demasiado tu ${plantas[planta].nombre}. Su salud está bajando.`);
    }
  };

  // Función para pasar día
  const pasarDia = () => {
    if (diasCrecimiento < plantas[planta].diasParaCrecer) {
      setDiasCrecimiento(diasCrecimiento + 1);
      
      // Posibilidad de plaga (20% de probabilidad)
      if (!hayPlaga && Math.random() < 0.2) {
        setHayPlaga(true);
        setSalud(Math.max(0, salud - 15));
        setMensaje(`¡Oh no! Ha aparecido una plaga en tu ${plantas[planta].nombre}. ¡Debes tratarla!`);
        return;
      }
      
      // Reducir salud si no ha sido regada suficiente
      if (aguaRecibida < Math.ceil(diasCrecimiento / 2)) {
        setSalud(Math.max(0, salud - 15));
        setMensaje(`Tu ${plantas[planta].nombre} necesita más agua. Su salud está bajando.`);
      } else {
        setMensaje(`Ha pasado un día. Tu ${plantas[planta].nombre} está creciendo bien.`);
      }
      
      // Comprobar si la planta ha muerto
      if (salud <= 0) {
        setJuegoTerminado(true);
        setResultadoFinal(`Tu ${plantas[planta].nombre} se ha marchitado. ¡Puedes intentarlo de nuevo!`);
      }
      
      // Comprobar si la planta ha crecido completamente
      if (diasCrecimiento + 1 >= plantas[planta].diasParaCrecer && aguaRecibida >= plantas[planta].aguaNecesaria && salud > 30) {
        setJuegoTerminado(true);
        setResultadoFinal(`¡Felicidades! Tu ${plantas[planta].nombre} ha crecido satisfactoriamente. ¡Eres un gran jardinero!`);
      }
    }
  };

  // Función para tratar plaga
  const tratarPlaga = (metodo) => {
    setPlagaTratada(true);
    setHayPlaga(false);
    
    if (metodo === 'natural') {
      setMensaje(`Has usado métodos naturales para eliminar la plaga. ¡Bien hecho!`);
      setSalud(Math.min(100, salud + 5));
    } else {
      setMensaje(`Has usado insecticida para eliminar la plaga. Funciona, pero no es tan ecológico.`);
    }
  };

  // Función para reiniciar juego
  const reiniciarJuego = () => {
    setEtapaActual('inicio');
    setPlanta(null);
    setDiasCrecimiento(0);
    setAguaRecibida(0);
    setTierraPreparada(false);
    setHayPlaga(false);
    setPlagaTratada(false);
    setSalud(100);
    setMensaje('¡Bienvenido al huerto escolar! Primero debemos preparar la tierra.');
    setJuegoTerminado(false);
    setResultadoFinal('');
  };

  // Mostrar imagen de la planta según estado
  const mostrarImagenPlanta = () => {
    if (!planta) return null;
    
    if (diasCrecimiento < Math.floor(plantas[planta].diasParaCrecer / 3)) {
      return <div className="text-6xl">{plantas[planta].imagenSemilla}</div>;
    } else if (diasCrecimiento < plantas[planta].diasParaCrecer) {
      return <div className="text-6xl">{plantas[planta].imagenCreciendo}</div>;
    } else {
      return <div className="text-6xl">{plantas[planta].imagenFinal}</div>;
    }
  };

  return (
    <div className="bg-green-100 p-6 rounded-lg shadow-md max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold text-green-800 mb-4">El huerto escolar</h1>
      
      {/* Panel de información */}
      <div className="bg-white p-4 rounded mb-4">
        <p className="mb-2">{mensaje}</p>
        
        {planta && !juegoTerminado && (
          <div className="mt-2">
            <p><strong>Planta:</strong> {plantas[planta].nombre}</p>
            <p><strong>Días:</strong> {diasCrecimiento}/{plantas[planta].diasParaCrecer}</p>
            <p><strong>Agua:</strong> {aguaRecibida}/{plantas[planta].aguaNecesaria}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${salud}%` }}></div>
            </div>
            <p><strong>Salud:</strong> {salud}%</p>
          </div>
        )}
      </div>
      
      {/* Visualización de la planta */}
      {planta && (
        <div className="my-4 flex justify-center items-center h-24">
          {hayPlaga && <div className="text-4xl mr-2">🐞</div>}
          {mostrarImagenPlanta()}
        </div>
      )}
      
      {/* Controles de juego */}
      <div className="mt-4">
        {etapaActual === 'inicio' && (
          <button 
            className="bg-brown-500 hover:bg-brown-600 text-white font-bold py-2 px-4 rounded"
            onClick={prepararTierra}
          >
            Preparar la tierra
          </button>
        )}
        
        {etapaActual === 'elegirPlanta' && (
          <div>
            <p className="mb-2 font-bold">¿Qué quieres plantar?</p>
            <div className="flex justify-center space-x-2">
              <button 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => elegirPlanta('lechuga')}
              >
                Lechuga 🥬
              </button>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => elegirPlanta('tomate')}
              >
                Tomate 🍅
              </button>
              <button 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => elegirPlanta('zanahoria')}
              >
                Zanahoria 🥕
              </button>
            </div>
          </div>
        )}
        
        {etapaActual === 'cuidado' && !juegoTerminado && (
          <div>
            {hayPlaga ? (
              <div>
                <p className="mb-2 font-bold">¡Hay una plaga! ¿Cómo quieres tratarla?</p>
                <div className="flex justify-center space-x-2">
                  <button 
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => tratarPlaga('natural')}
                  >
                    Usar métodos naturales 🌿
                  </button>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => tratarPlaga('insecticida')}
                  >
                    Usar insecticida 🧪
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center space-x-2">
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={regar}
                >
                  Regar 💧
                </button>
                <button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                  onClick={pasarDia}
                >
                  Pasar día ☀️
                </button>
              </div>
            )}
          </div>
        )}
        
        {juegoTerminado && (
          <div>
            <p className="text-xl font-bold my-4">{resultadoFinal}</p>
            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
              onClick={reiniciarJuego}
            >
              Jugar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HuertoEscolar;