import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const initialBalance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const transactions = await this.find();

    const balance = transactions.reduce((acc, cur) => {
      const parsedValue = Number(cur.value);

      if (cur.type === 'income') {
        acc.income += parsedValue;
      }

      if (cur.type === 'outcome') {
        acc.outcome += parsedValue;
      }

      acc.total = acc.income - acc.outcome;

      return acc;
    }, initialBalance);

    return balance;
  }
}

export default TransactionsRepository;
