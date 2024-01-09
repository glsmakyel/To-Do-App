import React, { useState } from "react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
import { useEffect } from "react";


function App() {
	const [isler, setIsler] = useState(JSON.parse(localStorage.getItem("isler")) ?? []);
	const metinRef = useRef(0);
	const zamanRef = useRef(0);
	const ekle = () => {
		let metin = metinRef.current.value.trim();
		let zaman = zamanRef.current.value;
		if (metin === "" || zaman === "") return;

		if (new Date(zaman) - Date.now() < 0) {
			alert("Geçmiş bir tarih girdiniz");
			return
		};
		setIsler(x => [
			{ id: uuidv4(), metin, tamamlandi: false, zaman },
			...x,
		]);
	};
	const sil = id => {
		setIsler(x => x.filter(is => is.id !== id));
	};
	const tamamlandi = id => {
		let yeniDizi = [];
		isler.forEach(is => {
			if (is.id === id) is.tamamlandi = !is.tamamlandi;
			yeniDizi.push(is);
		});
		setIsler(yeniDizi);
	};

	useEffect(() => {
		localStorage.setItem("isler", JSON.stringify(isler));
		metinRef.current.value = "";
		zamanRef.current.value = "";
	}, [isler])


	return (
		<div className=" border w-[600px] mx-auto">
			<div className="flex">
				<input ref={metinRef} className="border flex-1" type="text" />
				<input ref={zamanRef} type="datetime-local" />
				<button onClick={ekle} className="bg-green-500 p-1">
					Ekle
				</button>
			</div>
			<div>
				<section>
					{isler.map(is => (
						<article key={is.id}
							className={classNames("mt-4", "flex", {
								"bg-blue-500": !is.tamamlandi,
								"bg-green-700": is.tamamlandi,
							})}>
							<span className={classNames("flex-1", { "line-through": is.tamamlandi })}>{is.metin}</span>

							<div style={{ justifyContent: "flex-end" }} className="flex w-full">

								<span>
									{((new Date(is.zaman) - Date.now()) / (1000 * 60 * 60 * 24)).toFixed(0)} gün kaldı
								</span>

								<button className="bg-green-500 p-1" onClick={() => tamamlandi(is.id)}>
									-
								</button>
								<button className="p-1 bg-red-500" onClick={() => sil(is.id)}>
									x
								</button>
							</div>
						</article>
					))}
				</section>
			</div >
		</div >
	);
}

export default App;
