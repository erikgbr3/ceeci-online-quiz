import db from "./index";

export const checkUserEmailPassword = async (_email, password) => {
  const user = await db.User.findOne(
    { 
      where: { email: _email },
      attributes: ['id','name', 'lastName', 'email', 'password', 'rol']
    }
  );

  if (!user) {
    return null;
  }

  if (!user.isValidPassword(password)) {
    return null;
  }

  const { id, name, lastName, email, rol, } = user;
  console.log(user);
  return {
    id,
    name,
    lastName,
    email,
    rol,
  };
};
