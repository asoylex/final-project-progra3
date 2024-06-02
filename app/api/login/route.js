import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import encryptText from '../../utils/helper'


export  async function POST(request) {

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ message: 'Última palabra eliminada con éxito', status :401})
  }

  const filePath = path.join(process.cwd(), 'public', 'user_credentials.json');

  try {
    // Leer el archivo si existe
    const jsonData = await fs.readFile(filePath, 'utf8');
    const users = JSON.parse(jsonData).users;
    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
      return NextResponse.json({ status: 200, message: "Login ejecutado correctamente" })

    } else {
      return NextResponse.json({ status: 401, message: "Credenciales invalidas" })
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Si el archivo no existe, crearlo con un usuario por defecto

      const userEncrupted = encryptText(username)
      const passwordEncrypted = encryptText(password)

      const defaultUser = { username: userEncrupted, password: passwordEncrypted };

      const users = [defaultUser];
      await fs.writeFile(filePath, JSON.stringify({ users }, null, 2), 'utf8');

      // Verificar si las credenciales coinciden con el usuario por defecto
      if (username === defaultUser.username && password === defaultUser.password) {
        return NextResponse.json({ status: 200, message: "Login ejecutado correctamente" })
      } else {
        return NextResponse.json({ status: 401, message: "Credenciales invalidas" });
      }
    } else {
      return NextResponse.json({ status: 500, message: error });
    }
  }
}
