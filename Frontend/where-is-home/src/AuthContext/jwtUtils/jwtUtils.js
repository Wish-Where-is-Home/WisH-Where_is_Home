import jwt from 'jsonwebtoken';

const createJWTToken = (user) => {
  if (!user) {
    throw new Error('User is not authenticated');
  }

  // Aqui você pode ajustar o payload do token de acordo com suas necessidades
  const payload = {
    userId: user.uid,
    email: user.email,
    // Adicione quaisquer outros dados relevantes que você deseja incluir no token
  };

  // Chave secreta para assinar o token (substitua por uma chave segura em produção)
  const secretKey = 'your_secret_key';

  // Opções do token JWT
  const options = {
    expiresIn: '1h', // Tempo de expiração do token (1 hora, por exemplo)
  };

  // Criação do token JWT
  const token = jwt.sign(payload, secretKey, options);

  return token;
};

export default createJWTToken;
