import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Asegurarnos de que el cuerpo de la solicitud esté en formato JSON
    const body = await request.json();
    
    const randKey = Math.random().toString(36).substring(7);
   // Ruta al archivo JSON
    const filePath = path.join(process.cwd(), 'public/user', 'words.json');

    // Verificar si el archivo existe, y si no, crearlo
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({ words: [] }, null, 2));
    }

    // Leer el contenido existente del archivo JSON
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Agregar la nueva palabra
    jsonData.words.push(body);

    // Guardar los datos actualizados en el archivo JSON
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    // Devolver una respuesta de éxito
    return NextResponse.json({ message: 'Palabra guardada exitosamente' }); 
  } catch (error) {
    console.error('Error al guardar la palabra:', error);
    return NextResponse.json({ message: error.message, status: 500 });
  }
}
