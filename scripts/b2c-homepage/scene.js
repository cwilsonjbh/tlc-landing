// Progressive enhancement: content, chapter controls and a dimensional illustration work without WebGL.
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
if(!motionPreference.matches){
  const start3D=async()=>{
    try{
      const T=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
      const canvas=document.getElementById('journey-canvas'),space=document.getElementById('scene-space');
      const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
      renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
      const scene=new T.Scene();
      scene.fog=new T.Fog(0xffffff,14,23);
      const camera=new T.PerspectiveCamera(34,1,.1,150);
      scene.add(new T.HemisphereLight(0xffffff,0xaab6a8,1.4));
      const sun=new T.DirectionalLight(0xffecd5,3.2);sun.position.set(-3,9,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-7;sun.shadow.normalBias=.025;sun.shadow.radius=4;sun.shadow.blurSamples=8;scene.add(sun);scene.add(sun.target);
      const fill=new T.DirectionalLight(0xe3efff,1.8);fill.position.set(4,2,-4);scene.add(fill);
      // Matching photographic vignettes travel through the original Z-axis camera path.
      const images=['morning-waking-v1','journey-food-v1','journey-cafe-v1','journey-restaurant-v1','journey-photo-log-v1','journey-evening-v1','journey-sleeping-v1'];
      const worlds=[];
      for(let i=0;i<=images.length;i++){const g=new T.Group();g.position.set(0,0,-i*12);scene.add(g);worlds.push(g);}
      await Promise.all(images.map(async(name,index)=>{
        const texture=await new T.TextureLoader().loadAsync('/images/'+name+'.png');
        texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
        const sprite=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,toneMapped:false,depthWrite:false}));
        const height=5.1;
        sprite.scale.set(height*texture.image.width/texture.image.height,height,1);
        sprite.position.set(0,1.1,0);worlds[index+1].add(sprite);
      }));
      let target=window.tlcJourneyProgress||0,current=target,visible=false,raf=0,last=0;
      function resize(){const w=space.clientWidth,h=space.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
      new ResizeObserver(resize).observe(space);resize();
      function render(ts){
        raf=0;if(!visible||document.hidden||motionPreference.matches||document.body.classList.contains('motion-reduced')||document.body.classList.contains('short-screen'))return;
        const dt=Math.min(50,ts-last||16);last=ts;current+=(target-current)*(1-Math.exp(-dt/80));
        const sceneProgress=Math.min(images.length,Math.max(1,current+1));
        // Keep the focal scene clear. Adjacent scenes enter only during actual Z travel.
        worlds.forEach((world,index)=>{world.visible=index>0&&Math.abs(index-sceneProgress)<.999;});
        const i=Math.min(images.length-1,Math.floor(sceneProgress)),p=Math.min(1,sceneProgress-i),a=worlds[i].position,b=worlds[i+1].position;
        const x=T.MathUtils.lerp(a.x,b.x,p),z=T.MathUtils.lerp(a.z,b.z,p);
        const narrow=space.clientWidth<430;
        const dist=narrow?9.5:9.3;
        // Travel forwards down Z. Each successive world approaches the viewer from depth.
        camera.position.set(.65,4.0,z+dist);
        camera.lookAt(0,.82,z);sun.position.set(-3,9,z+6);sun.target.position.set(0,0,z);
        renderer.render(scene,camera);raf=requestAnimationFrame(render);
      }
      function wake(){if(visible&&!raf&&!document.hidden&&!motionPreference.matches&&!document.body.classList.contains('motion-reduced')&&!document.body.classList.contains('short-screen'))raf=requestAnimationFrame(render);}
      addEventListener('tlc:journey',e=>{target=e.detail.progress;wake();});
      document.addEventListener('visibilitychange',wake);
      motionPreference.addEventListener('change',wake);
      addEventListener('tlc:motion',wake);
      new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;wake();},{rootMargin:'100px'}).observe(space);
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.remove('webgl-ready');visible=false;if(raf)cancelAnimationFrame(raf);});
      document.body.classList.add('webgl-ready');
    }catch(error){console.warn('TLC illustration fallback active:',error.message);}
  };
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();start3D();}},{rootMargin:'650px'});observer.observe(document.getElementById('journey'));
}
