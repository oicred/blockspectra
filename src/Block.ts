import { Field, SmartContract, state, State, method, Poseidon } from 'o1js';

export class Block extends SmartContract {
  // private state: Acess to contract modified if private state is knowned
  @state(Field) privatestate = State<Field>();

  @method async initState(salt: Field, firstSecret: Field) {
    this.privatestate.set(Poseidon.hash([salt, firstSecret]));
  }

  @method async block(salt: Field, secret: Field) {
    const privatestate = this.privatestate.get();
    this.privatestate.requireEquals(privatestate);

    Poseidon.hash([salt, secret]).assertEquals(privatestate);
    this.privatestate.set(Poseidon.hash([salt, secret.add(1)]));
  }
}