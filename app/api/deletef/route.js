import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';


export async function POST(){
    
    const filePath = path.join(process.cwd(), 'public', 'user', 'words.json');
    try {

      const data = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(data);
  

      if (jsonData.words && jsonData.words.length > 0) {
        // Eliminar el primer objeto del array de palabras
        jsonData.words.shift();
  
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');

        return NextResponse.json({ message: 'Primera palabra eliminada con éxito' });

      } else {
        return NextResponse.json({ message: 'No hay palabras para eliminar' });
      }
    } catch (error) {
      return NextResponse.json({ message: error.message, status: 500 });
    }

}