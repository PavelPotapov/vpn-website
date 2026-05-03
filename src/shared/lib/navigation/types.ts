export interface NavigationTransitionRule {
  from?: RegExp | string;
  to?: RegExp | string;
  viewTransition: boolean;
}
