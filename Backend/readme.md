Iniciar el servidor:
en src

el comando es:

npx ts-node index.ts



Detener la instancia que está usando el puerto 3000

netstat -ano | findstr :3000
taskkill /PID <PID> /F
taskkill /PID 23304 /F
