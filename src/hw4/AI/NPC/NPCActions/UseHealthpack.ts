import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Battler from "../../../GameSystems/BattleSystem/Battler";
import Healthpack from "../../../GameSystems/ItemSystem/Items/Healthpack";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";
import Finder from "../../../GameSystems/Searching/Finder";
import Item from "../../../GameSystems/ItemSystem/Item";


export default class UseHealthpack extends NPCAction {
    
    // The targeting strategy used for this GotoAction - determines how the target is selected basically
    protected override _targetFinder: Finder<Battler>;
    // The targets or Targetable entities 
    protected override _targets: Battler[];
    // The target we are going to set the actor to target
    protected override _target: Battler | null;

    public constructor(parent: NPCBehavior, actor: NPCActor) { 
        super(parent, actor);
    }

    public performAction(target: Battler): void {
        let health_pack: Healthpack = this.actor.inventory.find((item: Item) => { return item instanceof Healthpack; }) as Healthpack;
        while (health_pack) {
            target.health += health_pack.health;

            this.actor.inventory.remove(health_pack.id);

            health_pack = this.actor.inventory.find((item: Item) => { return item instanceof Healthpack; }) as Healthpack;
        }

        this.finished();
    }

}