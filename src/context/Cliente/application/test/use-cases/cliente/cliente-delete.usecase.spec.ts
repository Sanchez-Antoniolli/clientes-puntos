/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ClienteDelete } from '@cliente/application/use-cases/ClienteDelete/ClienteDelete';
import { ClienteRepository } from '@cliente/core/repository/ClienteRepository';
import { ClienteNotFoundError } from '@cliente/core/exceptions/ClienteNotFoundError';
import { Cliente } from '@cliente/core/entities/Cliente';
import { ClienteId } from '@cliente/core/value-objects/ClienteId';
import { ClienteDni } from '@cliente/core/value-objects/ClienteDni';
import { ClienteNombre } from '@cliente/core/value-objects/ClienteNombre';
import { ClienteApellido } from '@cliente/core/value-objects/ClienteApellido';
import { ClienteSexo } from '@cliente/core/value-objects/ClienteSexo';
import { ClienteFechaNacimiento } from '@cliente/core/value-objects/ClienteFechaNacimiento';
import { ClienteStatus } from '@cliente/core/value-objects/ClienteStatus';
import { Categoria } from '@cliente/core/entities/Categoria';
import { CategoriaId } from '@cliente/core/value-objects/CategoriaId';
import { CategoriaNombre } from '@cliente/core/value-objects/CategoriaNombre';
import { CategoriaDescripcion } from '@cliente/core/value-objects/CategoriaDescripcion';
import { StatusCliente } from '@cliente/core/enums/StatusCliente';

describe('ClienteDelete (soft delete) Use Case', () => {
  let repo: jest.Mocked<ClienteRepository>;
  let useCase: ClienteDelete;
  let existing: Cliente;
  const defaultCategoria = new Categoria(
    new CategoriaId('11111111-1111-4111-8111-111111111111'),
    new CategoriaNombre('General'),
    new CategoriaDescripcion(null),
  );

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByDni: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    useCase = new ClienteDelete(repo);

    existing = new Cliente(
      new ClienteId('00000000-0000-4000-8000-000000000000'),
      new ClienteDni('33333333'),
      new ClienteNombre('María'),
      new ClienteApellido('López'),
      new ClienteSexo('F'),
      new ClienteFechaNacimiento(new Date('1995-03-03')),
      new ClienteStatus('activo'),
      defaultCategoria,
    );
  });

  it('lanza ClienteNotFoundError si no existe', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(useCase.run('no-existe')).rejects.toBeInstanceOf(
      ClienteNotFoundError,
    );
  });

  it('marca como inactivo y persiste el soft delete', async () => {
    repo.findById.mockResolvedValue(existing);
    repo.update.mockResolvedValue(undefined);

    await useCase.run(existing.id.value);

    // status debe ser INACTIVO
    expect((existing as any)._status.value).toBe(StatusCliente.Inactivo);
    // fechaBaja debe haberse asignado
    expect((existing as any)._fechaBaja.value).toBeInstanceOf(Date);
    // repo.update debe haberse llamado con el mismo agregado
    expect(repo.update).toHaveBeenCalledWith(existing);
  });
});
