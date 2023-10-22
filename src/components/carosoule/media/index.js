import media1 from "./media-1.jpeg";
import media2 from "./staking.jpeg";
import media3 from "./evolve.jpeg";
import media4 from "./market.jpeg";
import media5 from "./zombierun.jpeg";

export const media = [media1, media2, media3, media4, media5];
export const mediaByIndex = index => media[index % media.length];