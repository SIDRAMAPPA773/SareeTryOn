async function seed() {
  const res = await fetch('http://localhost:5000/api/sarees/seed', { method: 'POST' });
  console.log(await res.json());
}
seed();
