'use client';

import { FaceMesh } from '@mediapipe/face_mesh';
import { RefObject, useEffect } from 'react';
import { Group } from 'three';

export default function useFaceTracking(ref: RefObject<Group>) {
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) return;

    const faceMesh = new FaceMesh({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks?.length) return;
      const face = results.multiFaceLandmarks[0][1];

      if (ref.current) {
        ref.current.rotation.y = (face.x - 0.5) * 1.2;
        ref.current.rotation.x = (face.y - 0.5) * 0.6;
      }
    });

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      const loop = async () => {
        await faceMesh.send({ image: video });
        requestAnimationFrame(loop);
      };
      loop();
    });
  }, [ref]);
}

