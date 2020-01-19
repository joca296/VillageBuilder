export class Village {
  id:string;
  x:number;
  y:number;
  owner:string;
  name:string;
  barracksLv:number;
  lumberMillLv:number;
  goldMineLv:number;
  gold:number;
  lumber:number;
  units:number;
  unitQueue?:Array<number>;
  lumberMillUpgradeTime?:number;
  goldMineUpgradeTime?:number;
  barracksUpgradeTime?:number;
}
