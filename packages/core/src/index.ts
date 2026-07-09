import { Horizon } from 'stellar-sdk';

export function getHorizonServer(url: string): Horizon.Server {
  return new Horizon.Server(url);
}
