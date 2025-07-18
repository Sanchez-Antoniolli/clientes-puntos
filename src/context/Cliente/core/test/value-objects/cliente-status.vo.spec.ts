import { StatusCliente } from '../../enums/StatusCliente';
import { ClienteStatus } from '../../value-objects/ClienteStatus';

describe('ClienteStatus VO', () => {
  it('acepta los tres estados válidos', () => {
    Object.values(StatusCliente).forEach((s) => {
      expect(() => new ClienteStatus(s)).not.toThrow();
      expect(new ClienteStatus(s).value).toBe(s);
    });
  });

  it('lanza si el estado no es válido', () => {
    expect(() => new ClienteStatus('otro')).toThrow(
      /tiene un formato inválido/,
    );
  });
});
