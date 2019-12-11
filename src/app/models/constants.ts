export class Constants {
  static x:number = 100;
  static y:number = 100;

  static goldGenerationPerHour:number = 100;
  static goldCap:number = 1500;
  static goldMineUpgradeCostGold:number = 300;
  static goldMineUpgradeCostLumber:number = 500;
  static goldMineUpgradeMulti:number = 1.35;

  static lumberGenerationPerHour:number = 200;
  static lumberCap = 3000;
  static lumberMillUpgradeCostGold:number = 200;
  static lumberMillUpgradeCostLumber:number = 400;
  static lumberMillUpgradeMulti:number = 1.35;

  static upgradeTime:number = 45;

  static calcMulti(buildingType:string, buildingLevel:number) {
    switch (buildingType) {
      case "gm" : return buildingLevel * this.goldMineUpgradeMulti; break;
      case "lm" : return buildingLevel * this.lumberMillUpgradeMulti; break;
      default : return 0;
    }
  }

  static calcUpgradeTime(buildingType:string, buildingLevel:number):number {
    return Math.floor(this.upgradeTime * this.calcMulti(buildingType,buildingLevel));
  }

  static calcUpgradeCostLumber(buildingType:string, buildingLevel:number):number {
    switch (buildingType) {
      case "gm" : return Math.floor(this.goldMineUpgradeCostLumber * this.calcMulti(buildingType, buildingLevel)); break;
      case "lm" : return Math.floor(this.lumberMillUpgradeCostLumber * this.calcMulti(buildingType, buildingLevel)); break;
      default : return 0;
    }
  }

  static calcUpgradeCostGold(buildingType:string, buildingLevel:number):number {
    switch (buildingType) {
      case "gm" : return Math.floor(this.goldMineUpgradeCostGold * this.calcMulti(buildingType, buildingLevel)); break;
      case "lm" : return Math.floor(this.lumberMillUpgradeCostGold * this.calcMulti(buildingType, buildingLevel)); break;
      default : return 0;
    }
  }

  static calcCap(buildingType:string, buildingLevel:number):number {
    switch (buildingType) {
      case "gm" : return Math.floor(this.goldCap * this.calcMulti(buildingType, buildingLevel)); break;
      case "lm" : return Math.floor(this.lumberCap * this.calcMulti(buildingType, buildingLevel)); break;
      default : return 0;
    }
  }

  static calcGenPerHour(buildingType:string, buildingLevel:number):number {
    switch (buildingType) {
      case "gm" : return Math.floor(this.goldGenerationPerHour * this.calcMulti(buildingType, buildingLevel)); break;
      case "lm" : return Math.floor(this.lumberGenerationPerHour * this.calcMulti(buildingType, buildingLevel)); break;
      default : return 0;
    }
  }

  static validateBuildingType(buildingType:string):boolean {
    const acceptedTypes:string[] = ['gm','lm','ba'];
    return acceptedTypes.includes(buildingType);
  }
}
