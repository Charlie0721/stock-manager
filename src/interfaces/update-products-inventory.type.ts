export type TUpdateProductsInventory = {
  idproducto: number;
  cantidad: number;
  cantidadActual: number;
  operacion: number; //1 sumar, 2 restar, 3 setear a cero cantidad
};
