# Naloga 1: XML in JSON – Smart Language Learning Assistant

Projekt je pripravljen v Javi (Maven) in uporablja tri povezane XML datoteke v mapi `data/`:

- `data/besede.xml` – besede in slovarski podatki,
- `data/prevodi.xml` – prevodi, povezani z besedami prek `besedaId`,
- `data/rezultatiKvizov.xml` – rezultati kvizov, povezani z besedami prek `besedaId`.

Program:
1. prebere in deserializira vse tri XML datoteke,
2. poveže podatke prek ID-jev,
3. uporabnika vpraša za prag uspešnosti,
4. v konzoli prikaže besede z uspešnostjo pod oziroma enako izbranemu pragu,
5. iste filtrirane rezultate izvozi v `filtrirano.json` in `filtrirano.xml`.

## Zagon

Potrebujete Java 17+ in Maven.

V korenski mapi projekta zaženite:

```bash
mvn clean compile exec:java
```

Ko program vpraša za prag, vnesite npr. `60`.

Po zagonu se v korenski mapi ustvarita:

- `filtrirano.json`
- `filtrirano.xml`

V oddanem ZIP-u sta priložena tudi primera izhoda, ustvarjena za prag `60`.
