export const generateDamage = async (): Promise<number> => {
  const damage = Math.floor(Math.random() * 10) + 15;

  const promise = new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      const critical = Math.floor(Math.random() * 50);
      if (critical === 50) resolve(100);
      else if (critical === damage) resolve(damage + 25);
      else resolve(damage);
    }, 5);
  });
  return promise;
};
