import { useState, useEffect, useRef, } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import type {JSONPunkt, JSONStroke} from '@/lib/types'

const CanvasDoPisania = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const [wymiary, setWymiary] = useState({ w: 0, h: 0 });

    const [czyrysuje, setCzyrysuje] = useState(false)
    const [linie, setLinie] = useState<{points: number[]}[]>([])

    const strokeSetRef = useRef<JSONStroke[]>([]); // ref do przechowywania zestawu linii
    const aktualnyStorkeRef = useRef<JSONStroke | null>(null); // ref do przechowywania aktualnej linii


    useEffect(() => {
        if (!divRef.current) return;

        const obserwator = new ResizeObserver((entries) => {
            for(let entry of entries) {
                setWymiary({
                    w: entry.contentRect.width,
                    h: entry.contentRect.height
                });
            }
        }); 

        obserwator.observe(divRef.current);

        return () => {
            obserwator.disconnect();
        };

    }, []);
 
    const pobierzaktulanyczas = () => {
        return Number((performance.now() / 1000).toFixed(2))
    }

    const handleMouseDown = (e: any) => {
        setCzyrysuje(true);
        const pozycja = e.target.getStage().getPointerPosition();
        if (!pozycja) return;
        
        // rozpoczynamy zapis do wektora 

        aktualnyStorkeRef.current = { points: [{ x: pozycja.x, y: pozycja.y, t: pobierzaktulanyczas() }] };

        setLinie([...linie, { points: [pozycja.x, pozycja.y] }]);

    }

    const handleMouseMove = (e: any) => {
        if (!czyrysuje || !aktualnyStorkeRef.current) return;
        const pozycja = e.target.getStage().getPointerPosition();
        if (!pozycja) return;

        // dodajemy punkt do aktualnej linii
        aktualnyStorkeRef.current.points.push({ x: pozycja.x, y: pozycja.y, t: pobierzaktulanyczas() });

        const ostatniindeks = linie.length - 1;
        
        if (ostatniindeks >= 0) {
            const nowelinie = [...linie];
            nowelinie[ostatniindeks] = {
                points: nowelinie[ostatniindeks].points.concat([pozycja.x, pozycja.y])
            };
            setLinie(nowelinie);
        }
    };

    const handleMouseUp = () => {
        if (!czyrysuje || !aktualnyStorkeRef.current) return;
        setCzyrysuje(false);

        strokeSetRef.current.push(aktualnyStorkeRef.current);
        aktualnyStorkeRef.current = null;

        console.log("debug-current-lines: ", strokeSetRef.current);
    };

    const DaneDoWyslania = () => {
        const json = JSON.stringify(strokeSetRef.current);
        console.log("debug-json-api-form: ", json);
    };

    return (
    <div className="flex flex-col gap-2">
      <div 
        ref={divRef}
        className="mt-2 relative h-40 w-full max-w-sm rounded-2xl border-2 border-dashed border-border bg-muted/30 overflow-hidden"
      >
        {wymiary.w > 0 && (
          <Stage 
            width={wymiary.w} 
            height={wymiary.h}
            className="absolute top-0 left-0"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <Layer>
              {linie.map((linia, i) => (
                <Line key={i} points={linia.points} stroke="#000000" strokeWidth={3} tension={0.5} lineCap="round" lineJoin="round" />
              ))}
            </Layer>
          </Stage>
        )}
      </div>

      <button 
        onClick={DaneDoWyslania}
        className="max-w-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm"
      >
        Rozpoznaj pismo
      </button>
    </div>
  );



}

export default CanvasDoPisania