class Bicicleta {
  constructor(id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
  }

  toString() {
    return `id: ${this.id}, color: ${this.color}, modelo: ${this.modelo}`;
  }
}

Bicicleta.allBicis = [];

Bicicleta.add = function (unaBici) {
  Bicicleta.allBicis.push(unaBici);
};

Bicicleta.findById = function (id) {
  return Bicicleta.allBicis.find(x => x.id == id);
};

Bicicleta.removeById = function (id) {
  const bici = Bicicleta.findById(id);

  if (!bici) {
    return null;
  }

  Bicicleta.allBicis = Bicicleta.allBicis.filter(x => x.id != id);
  return bici;
};

const bici1 = new Bicicleta(1, 'Roja', 'Urbana', [14.0723, -87.1921]);
const bici2 = new Bicicleta(2, 'Azul', 'Montaña', [14.0735, -87.1905]);

Bicicleta.add(bici1);
Bicicleta.add(bici2);

module.exports = Bicicleta;