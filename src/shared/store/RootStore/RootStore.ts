import CartStore from './CartStore';
import QueryParamsStore from './QueryParamsStore';
import UserStore from './UserStore';

export default class RootStore {
  readonly query = new QueryParamsStore();
  userStore = new UserStore();
  cartStore = new CartStore();

  constructor() {
    if (typeof window !== "undefined") {
      this.query.setSearch(window.location.search);
    }
    this.cartStore.setUserStore(this.userStore);
  }
}
