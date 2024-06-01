import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';



export async function POST(){
    const filePath = path.join(process.cwd(), 'public', 'user', 'words.json');
  
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(data);
  
      if (jsonData.words && jsonData.words.length > 0) {
        jsonData.words.pop();
  
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
        console.log('Última palabra eliminada con éxito');

        return NextResponse.json({ message: 'Última palabra eliminada con éxito' });
      } else {
        return NextResponse.json({ message: 'No hay palabras para eliminar' });
      }
    } catch (error) {
      return NextResponse.json({ message: error.message, status: 500 });
    }  
}