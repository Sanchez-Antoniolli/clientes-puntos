import { LoteId } from '../value-objects/LoteId';
import { BatchEstado } from '../enums/BatchEstado';
import { Lote } from '../entities/Lote';
import { TransactionContext } from '../../../../shared/core/interfaces/TransactionContext';

/**
 * Puerto de repositorio para la entidad Lote (batch de puntos).
 * Permite abstraer la persistencia y búsquedas de lotes.
 */
export interface LoteRepository {
  /**
   * Obtiene todos los lotes registrados en el sistema.
   * @returns Lista completa de lotes
   */
  findAll(): Promise<Lote[]>;

  /**
   * Busca un lote por su identificador.
   * @param id  Identificador del lote
   * @returns El lote o null si no existe
   */
  findById(id: LoteId): Promise<Lote | null>;

  /**
   * Obtiene todos los lotes de un cliente, opcionalmente filtrados por estado.
   * @param clienteId  Identificador del cliente
   * @param estado     Opcional: filtrar por estado de lote (PENDIENTE, DISPONIBLE, EXPIRADO)
   * @returns Lista de lotes
   */
  findByCliente(clienteId: string, estado?: BatchEstado): Promise<Lote[]>;

  /**
   * Persiste un lote nuevo en el repositorio.
   * @param lote  Lote a guardar
   */
  save(lote: Lote, ctx?: TransactionContext): Promise<void>;

  /**
   * Actualiza un lote existente (e.g., remaining, estado).
   * @param lote  Lote con cambios
   */
  update(lote: Lote, ctx?: TransactionContext): Promise<void>;

  /**
   * Elimina (o marca como eliminado) un lote.
   * @param id  Identificador del lote
   */
  delete(id: LoteId, ctx?: TransactionContext): Promise<void>;
}
