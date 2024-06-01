"use client";
import { useState } from 'react';

const WordForm = () => {
  const [word, setWord] = useState({
    spanish: 'casa',
    italian: 'casa',
    french: 'maison',
    german: 'haus',
    english: 'house'
  });
  const [mode, setMode] = useState('add'); // Estado para controlar el modo
  const [translate, setTranslate] = useState(''); // Estado para controlar la traducción
  const [translation, setTranslation] = useState(''); // Estado para almacenar la traducción
  const [targetLanguageAudio, setTargetLanguageAudio] = useState('es'); // Estado para almacenar el idioma objetivo
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setWord({ ...word, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log('Saving word:', word);
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(word)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Word saved successfully');
        setWord({
          spanish: '',
          italian: '',
          german: '',
          french: '',
          english: ''
        });
      } else {
        console.error('Error saving word');
      }
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  const handleTranslate = (language: string) => {

    if (translate) {
      translateText(translate, language).then((data) => {
        setTranslation(data);
      });
    }
  };

  const handleDeleteFirstNode = async () => {
    try {
      const response = await fetch('/api/deletef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log(response)

    } catch (error) {
      console.error('Error al elimnar el primer nodo:', error);
    }
  };
  

  const handleDeleteLastNode = async () => {
   
    try {
      const response = await fetch('/api/deletel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log(response)

    } catch (error) {
      console.error('Error al elimnar el último nodo:', error);
    }

  };

  const translateText = async (text: any, targetLanguage: any) => {
    const apiKey = 'AIzaSyAEMUbDuImkLj9olXF-Mya0G1v2Vowd6uQ'; // Reemplaza con tu propia clave de API

    switch (targetLanguage) {

      case 'spanish':
        targetLanguage = 'es';
        setTargetLanguageAudio('es');
        break;
      case 'italian':
        targetLanguage = 'it';
        setTargetLanguageAudio('it');
        break;
      case 'french':
        targetLanguage = 'fr';
        setTargetLanguageAudio('fr')
        break;
      case 'german':
        targetLanguage = 'de';
        setTargetLanguageAudio('de')
        break;
      case 'english':
        targetLanguage = 'en';
        break;
    }
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${text}&target=${targetLanguage}`;
    console.log(url + ' ' + text + ' ' + targetLanguage)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      console.log('Translation:', data);
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      return null;
    }
  };

  const handleSpeak = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(translation);
    /* target language */
    switch(targetLanguageAudio){

       case 'es':
        utterance.lang = 'es-ES';
        break;

       case 'it':
        utterance.lang = 'it-IT';
        break;

       case 'fr':
        utterance.lang = 'fr-FR';
        break;

        case 'de':
        utterance.lang = 'de-DE';
        break;

        case 'en':

        utterance.lang = 'en-US';

        break;
    }
    synth.speak(utterance);


  };

  return (
    <div className='flex justify-center'>
      <div className='overflow-hidden rounded-lg bg-white shadow m-10 lg:text-center lg:w-1/2'>
        <div className='justify-center mt-20 font-mono px-4 py-5 sm:p-6'>
          <h1 className='text-4xl text-black font-bold p-2'>Diccionario</h1>
          <br />
          <div className='flex justify-around mb-4'>
            <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/70' onClick={() => setMode('add')}>Agregar al Diccionario</button>
            <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/70' onClick={() => setMode('translate')}>Traducir</button>
            <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/70' onClick={()=> handleDeleteLastNode()}>Eliminar Primer Nodo</button>
            <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/70' onClick={()=> handleDeleteLastNode()}>Eliminar Último Nodo</button>

          </div>

          {mode === 'add' && (
            <form onSubmit={handleSubmit}>
              <input
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type="text"
                name="spanish"
                value={word.spanish}
                onChange={handleChange}
                placeholder="Spanish"
              />
              <br />
              <input
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type="text"
                name="italian"
                value={word.italian}
                onChange={handleChange}
                placeholder="Italian"
              />
              <br />
              <input
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type="text"
                name="french"
                value={word.french}
                onChange={handleChange}
                placeholder="French"
              />
              <br />
              <input
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type="text"
                name="german"
                value={word.german}
                onChange={handleChange}
                placeholder="German"
              />
              <br />
              <input
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type="text"
                name="english"
                value={word.english}
                onChange={handleChange}
                placeholder="English"
              />
              <br />
              <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/70' type="submit">Guardar Palabra</button>
            </form>
          )}

          {mode === 'translate' && (
            <div>
              <input
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                type="text"
                name="translate"
                onChange={(e) => setTranslate(e.target.value)}
                value={translate}
                placeholder="Palabra a traducir"
              />
              <span>
                <br />
                {translation && (
                  <div>
                    <div>
                      <span className='text-black font-semibold'>Traducción:</span>
                      <br />
                      <span className='text-black'>{translation}</span>
                    </div>
                    <div>
                      <span className='text-black font-semibold'>Reproducción de Audio:</span>
                      <br />
                      <button
                        type="button"
                        onClick={handleSpeak}
                        className="rounded-full bg-black p-2 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                        </svg>

                      </button>
                    </div>
                  </div>
                )}
              </span>
              <br />
              <div className='flex justify-around'>
                <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/70' onClick={() => handleTranslate('spanish')}>Español</button>
                <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/70' onClick={() => handleTranslate('italian')}>Italiano</button>
                <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/70' onClick={() => handleTranslate('french')}>Francés</button>
                <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/70' onClick={() => handleTranslate('german')}>Alemán</button>
                <button className='rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/70' onClick={() => handleTranslate('english')}>Inglés</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordForm;
