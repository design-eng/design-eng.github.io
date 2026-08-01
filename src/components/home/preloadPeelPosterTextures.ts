import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import posterPurple from '../../assets/home-poster-sign-work-web.png';
import posterOrange from '../../assets/home-poster-help-dreamers-web.png';
import posterBlue from '../../assets/home-poster-take-back-process-web.png';
import posterGreen from '../../assets/home-poster-demo-green-web.png';

[
  posterPurple,
  posterOrange,
  posterBlue,
  posterGreen
].forEach((imageSrc) => {
  useLoader.preload(THREE.TextureLoader, imageSrc);
});
