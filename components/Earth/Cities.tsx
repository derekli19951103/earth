import { getPolygonCenter, GPSToCartesian } from "@/helpers/functions/geo";
import { GeoFeatures } from "@/types/utils";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { InstancedMesh, Object3D, Color } from "three";
import { EARTH_RADIUS } from "./Earth";

export const Cities = (props: {
  features: GeoFeatures[];
  onHoverCity: (city: GeoFeatures) => void;
}) => {
  const { features, onHoverCity } = props;
  const meshRef = useRef<InstancedMesh>(null);
  const tempObject = useRef(new Object3D());
  let instanceId: number = -1;

  const { raycaster } = useThree();

  useEffect(() => {
    for (let i = 0; i < features.length; i++) {
      const coord = getPolygonCenter(features[i]);
      const pos = GPSToCartesian(coord[0], coord[1], EARTH_RADIUS);

      tempObject.current!.position.set(pos.x, pos.y, pos.z);
      tempObject.current!.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.current!.matrix);
      meshRef.current!.setColorAt(i, new Color());
    }
    meshRef.current!.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state) => {
    raycaster.setFromCamera(state.mouse, state.camera);
    const intersects = raycaster.intersectObjects([meshRef.current!]);
    if (intersects.length > 0) {
      const iId = intersects[0].instanceId;

      if (iId !== undefined) {
        onHoverCity(features.at(iId)!);
        meshRef.current!.setColorAt(iId, new Color("cyan"));
        meshRef.current!.instanceColor!.needsUpdate = true;

        if (instanceId !== iId) {
          meshRef.current!.setColorAt(instanceId, new Color("white"));
          meshRef.current!.instanceColor!.needsUpdate = true;
        }
        instanceId = iId;
      }
    } else {
      meshRef.current!.setColorAt(instanceId, new Color("white"));
      meshRef.current!.instanceColor!.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, features.length]}>
      <sphereGeometry args={[0.05, 4, 4]} />
      <meshBasicMaterial color="white" />
    </instancedMesh>
  );
};
