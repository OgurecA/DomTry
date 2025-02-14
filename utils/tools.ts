export class tools {

  static async DetermineTeam(
    team1amount: number,
    team2amount: number,
    team1players: number,
    team2players: number,
    amount: number
  ): Promise<{ team: string }> {
    const totalPlayers = team1players + team2players;
    const maxAllowedDiff = Math.ceil(totalPlayers * 0.05); // 5% от общего числа игроков
    const totalDeposited = team1amount + team2amount;
    const criticalDepositThreshold = totalDeposited * 0.05; // 5% от всех вкладов

    let team: string;

    // Если вклад игрока ≥ 5% от всех вложенных денег, отправляем в команду с меньшим вкладом
    if (amount >= criticalDepositThreshold) {
      team = team1amount <= team2amount ? "Team1" : "Team2";
    }
    // Если разница в количестве игроков превышает 5%, отправляем в команду с меньшим числом игроков
    else if (Math.abs(team1players - team2players) > maxAllowedDiff) {
      team = team1players < team2players ? "Team1" : "Team2";
    }
    // Если разница в пределах 5%, отправляем в команду с меньшей суммой вкладов
    else {
      team = team1amount <= team2amount ? "Team1" : "Team2";
    }

    return { team };
  }
}

