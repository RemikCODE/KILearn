import { useState, useEffect, useRef, useMemo } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import { Check, X, ZoomIn, Sparkles, MousePointer2 } from 'lucide-react'
import type { JSONStroke } from '@/lib/types'

// Bazowa "referencyjna" rozdzielczość, w której zawsze trzymamy surowe punkty pisma.
// Niezależnie od tego, czy user pisze w małym boxie czy w powiększonym popupie,
// dane w strokeSetRef są przeliczane do TEJ jednej, stałej skali - więc to co
// leci do modelu jest spójne i "surowe" (piksele, nie ułamki 0-1), a nie zależy
// od tego jak duży akurat był Stage w momencie rysowania.
const BASE_W = 400
const BASE_H = 256

type TrybLupy = 'manual' | 'auto' | 'hover'

interface CanvasDoPisaniaProps {
    className?: string
    onAccept?: (json: string) => void
    onClear?: () => void
    // tekst aktualnie wyświetlanej fiszki - używany tylko do trybu "auto"
    // (auto-powiększenie na hover, jeśli tekst ma >= 2 słowa)
    text?: string
}

const CanvasDoPisania = ({ className, onAccept, onClear, text }: CanvasDoPisaniaProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [wymiary, setWymiary] = useState({ w: 0, h: 0 });

    const [czyrysuje, setCzyrysuje] = useState(false)
    // linie trzymane w BAZOWYCH współrzędnych (nie w pikselach aktualnego Stage)
    const [linie, setLinie] = useState<{points: number[]}[]>([])

    const strokeSetRef = useRef<JSONStroke[]>([]); // ref do przechowywania zestawu linii (bazowe współrzędne)
    const aktualnyStorkeRef = useRef<JSONStroke | null>(null); // ref do przechowywania aktualnej linii

    // --- powiększanie canvasa ---
    const [trybLupy, setTrybLupy] = useState<TrybLupy>('auto')
    const [najechano, setNajechano] = useState(false)
    const [manualWlaczony, setManualWlaczony] = useState(false)

    const liczbaSlow = useMemo(
        () => (text?.trim() ? text.trim().split(/\s+/).length : 0),
        [text]
    )

    const powiekszony =
        trybLupy === 'manual'
            ? manualWlaczony
            : trybLupy === 'hover'
                ? najechano
                : /* auto */ najechano && liczbaSlow >= 2;

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

    // przelicza pozycję kursora (piksele aktualnego Stage) na bazową skalę BASE_W x BASE_H
    const doWspolrzednychBazowych = (x: number, y: number) => {
        if (wymiary.w === 0 || wymiary.h === 0) return { x, y };
        return {
            x: x * (BASE_W / wymiary.w),
            y: y * (BASE_H / wymiary.h),
        };
    }

    // przelicza punkty z bazowej skali na piksele AKTUALNEGO Stage - tylko do rysowania
    const doWspolrzednychEkranu = (points: number[]) => {
        if (wymiary.w === 0 || wymiary.h === 0) return points;
        const skalaX = wymiary.w / BASE_W;
        const skalaY = wymiary.h / BASE_H;
        const wynik: number[] = [];
        for (let i = 0; i < points.length; i += 2) {
            wynik.push(points[i] * skalaX, points[i + 1] * skalaY);
        }
        return wynik;
    }

    const handleMouseDown = (e: any) => {
        setCzyrysuje(true);
        const pozycja = e.target.getStage().getPointerPosition();
        if (!pozycja) return;

        const bazowa = doWspolrzednychBazowych(pozycja.x, pozycja.y);

        // rozpoczynamy zapis do wektora (surowe, bazowe współrzędne - do modelu)
        aktualnyStorkeRef.current = { points: [{ x: bazowa.x, y: bazowa.y, t: pobierzaktulanyczas() }] };

        setLinie([...linie, { points: [bazowa.x, bazowa.y] }]);

    }

    const handleMouseMove = (e: any) => {
        if (!czyrysuje || !aktualnyStorkeRef.current) return;
        const pozycja = e.target.getStage().getPointerPosition();
        if (!pozycja) return;

        const bazowa = doWspolrzednychBazowych(pozycja.x, pozycja.y);

        // dodajemy punkt do aktualnej linii (bazowe współrzędne)
        aktualnyStorkeRef.current.points.push({ x: bazowa.x, y: bazowa.y, t: pobierzaktulanyczas() });

        const ostatniindeks = linie.length - 1;
        
        if (ostatniindeks >= 0) {
            const nowelinie = [...linie];
            nowelinie[ostatniindeks] = {
                points: nowelinie[ostatniindeks].points.concat([bazowa.x, bazowa.y])
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

    // czyści canvas (krzyżyk - odrzuć / zacznij od nowa)
    const wyczyscCanvas = () => {
        setLinie([]);
        strokeSetRef.current = [];
        aktualnyStorkeRef.current = null;
        onClear?.();
    };

    // zatwierdza aktualny zestaw linii (checkmark - zaakceptuj / wyślij dalej)
    // strokeSetRef zawiera już surowe współrzędne w stałej skali BASE_W x BASE_H,
    // więc niezależnie od tego czy user pisał powiększone czy nie - dane są spójne.
    const zatwierdzCanvas = () => {
        const json = JSON.stringify(strokeSetRef.current);
        console.log("debug-json-api-form: ", json);
        onAccept?.(json);
    };

    const przelaczTryb = (nowyTryb: TrybLupy) => {
        setTrybLupy(nowyTryb);
        if (nowyTryb !== 'manual') setManualWlaczony(false);
    }

    return (
    // stały "placeholder" w layoucie - nie przesuwa reszty strony gdy canvas się powiększa
    <div className={className ?? "relative mt-2 h-64 w-full max-w-xl"}>
      <div
        ref={divRef}
        onMouseEnter={() => setNajechano(true)}
        onMouseLeave={() => setNajechano(false)}
        className={
          powiekszony
            ? "absolute inset-x-[-25%] inset-y-[-40%] z-50 overflow-hidden rounded-2xl border-2 border-dashed border-primary bg-background shadow-2xl transition-all duration-200"
            : "absolute inset-0 z-0 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/30 transition-all duration-200"
        }
      >
        {/* mini panel w lewym górnym rogu canvasa - zatwierdź / wyczyść */}
        <div className="absolute left-2 top-2 z-10 flex flex-row gap-1">
          <button
            type="button"
            onClick={wyczyscCanvas}
            aria-label="Wyczyść canvas"
            title="Wyczyść"
            className="flex size-6 items-center justify-center rounded-md bg-red-500 text-white shadow-sm transition-colors hover:bg-red-600"
          >
            <X className="size-3.5" strokeWidth={3} />
          </button>
        </div>

        {/* mini panel w prawym górnym rogu - tryb powiększania (manual / auto / hover) */}
        <div className="absolute right-2 top-2 z-10 flex flex-row gap-1">
          <button
            type="button"
            onClick={zatwierdzCanvas}
            aria-label="Zatwierdź pismo"
            title="Zatwierdź"
            className="flex size-6 items-center justify-center rounded-md bg-green-500 text-white shadow-sm transition-colors hover:bg-green-600"
          >
            <Check className="size-3.5" strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={() => {
                przelaczTryb('manual');
                setManualWlaczony((v) => !v);
            }}
            aria-label="Powiększenie ręczne (przełącznik)"
            title="Ręczny przełącznik powiększenia"
            className={`flex size-6 items-center justify-center rounded-md shadow-sm transition-colors ${
              trybLupy === 'manual' && manualWlaczony
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/80 text-muted-foreground hover:bg-background'
            }`}
          >
            <ZoomIn className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => przelaczTryb('auto')}
            aria-label="Auto-powiększenie przy dłuższym tekście"
            title="Auto (powiększa na hover, gdy tekst ma 2+ słowa)"
            className={`flex size-6 items-center justify-center rounded-md shadow-sm transition-colors ${
              trybLupy === 'auto'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/80 text-muted-foreground hover:bg-background'
            }`}
          >
            <Sparkles className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => przelaczTryb('hover')}
            aria-label="Powiększenie po najechaniu kursorem"
            title="Powiększa zawsze po najechaniu kursorem"
            className={`flex size-6 items-center justify-center rounded-md shadow-sm transition-colors ${
              trybLupy === 'hover'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/80 text-muted-foreground hover:bg-background'
            }`}
          >
            <MousePointer2 className="size-3.5" />
          </button>
        </div>

        {wymiary.w > 0 && wymiary.h > 0 && (
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
                <Line
                  key={i}
                  points={doWspolrzednychEkranu(linia.points)}
                  stroke="#000000"
                  strokeWidth={Math.max(2, 3 * (wymiary.w / BASE_W))}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              ))}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}

export default CanvasDoPisania
