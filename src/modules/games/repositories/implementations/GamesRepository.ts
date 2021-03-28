import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('games')
      .where('title ILIKE :name', {name: `%${param}%`})
      .getMany()
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query('SELECT COUNT(*) FROM games'); 
    // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const gamesfilter = await this.repository
      .createQueryBuilder('games')
      .where('games.id = :id', {id})
      .getMany()

    const usersfinded = await this.repository
      .createQueryBuilder()
      .relation(Game, 'users')
      .of(gamesfilter)
      .loadMany()

    // Complete usando query builder
    return usersfinded
  }
}
