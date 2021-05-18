import { getRepository, Like, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    // Complete usando query builder
    return this.repository.query(`SELECT * FROM games g WHERE LOWER(g.title) LIKE LOWER('%${param}%')`);

    // Tentativa
    return this.repository
      .createQueryBuilder("games")
      .where({ title: Like(`%${param}%`) })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    // Complete usando raw query
    return this.repository.query("SELECT COUNT(*) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // Complete usando query builder
    return this.repository.query(`SELECT users.* FROM users
    INNER JOIN users_games_games ON users_games_games.usersId = users.id
    INNER JOIN games ON games.id = users_games_games.gamesId
    WHERE games.id = '${id}'`)

    // Tentativa
    return this.repository
      .createQueryBuilder("users")
      .from<User>(qb => {
        qb
          .innerJoin("users.id", "user_games_games")
          .innerJoin("user_games_games.gamesId", "games")
          .where("user_games_games.gamesId = :id", { id })
      }, "users")
      .getMany()
  }
}
