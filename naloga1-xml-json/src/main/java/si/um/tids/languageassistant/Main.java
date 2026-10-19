package si.um.tids.languageassistant;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import si.um.tids.languageassistant.model.*;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

public class Main {

    public static void main(String[] args) throws Exception {
        XmlMapper xmlMapper = XmlMapper.builder()
                .addModule(new JavaTimeModule())
                .build();

        ObjectMapper jsonMapper = new ObjectMapper();
        jsonMapper.registerModule(new JavaTimeModule());
        jsonMapper.enable(SerializationFeature.INDENT_OUTPUT);

        Besede besede = readXml(xmlMapper, "data/besede.xml", Besede.class);
        Prevodi prevodi = readXml(xmlMapper, "data/prevodi.xml", Prevodi.class);
        RezultatiKvizov rezultatiKvizov = readXml(xmlMapper, "data/rezultatiKvizov.xml", RezultatiKvizov.class);

        System.out.println("Naloženih besed: " + besede.getBesede().size());
        System.out.println("Naloženih prevodov: " + prevodi.getPrevodi().size());
        System.out.println("Naloženih rezultatov kvizov: " + rezultatiKvizov.getRezultati().size());
        System.out.println();

        Scanner scanner = new Scanner(System.in);
        System.out.print("Vnesite največjo uspešnost za prikaz šibkih besed (npr. 60): ");
        double meja;
        try {
            meja = Double.parseDouble(scanner.nextLine().trim());
        } catch (Exception e) {
            meja = 60.0;
            System.out.println("Neveljaven vnos. Uporabljena bo privzeta meja 60 %.\n");
        }

        Map<String, Beseda> besedeById = besede.getBesede().stream()
                .collect(Collectors.toMap(Beseda::getId, b -> b));

        Map<String, List<Prevod>> prevodiByBeseda = prevodi.getPrevodi().stream()
                .collect(Collectors.groupingBy(Prevod::getBesedaId));

        Map<String, List<RezultatKviza>> rezultatiByBeseda = rezultatiKvizov.getRezultati().stream()
                .collect(Collectors.groupingBy(RezultatKviza::getBesedaId));

        List<FiltriranZapis> filtrirani = new ArrayList<>();

        for (Map.Entry<String, List<RezultatKviza>> entry : rezultatiByBeseda.entrySet()) {
            String besedaId = entry.getKey();
            Beseda beseda = besedeById.get(besedaId);
            if (beseda == null) continue;

            List<RezultatKviza> rezultati = entry.getValue();
            long pravilni = rezultati.stream().filter(RezultatKviza::isPravilen).count();
            int vsi = rezultati.size();
            double uspesnost = vsi == 0 ? 0 : (pravilni * 100.0 / vsi);

            if (uspesnost <= meja) {
                String prevod = prevodiByBeseda.getOrDefault(besedaId, Collections.emptyList())
                        .stream()
                        .filter(p -> "SR".equalsIgnoreCase(p.getCiljniJezik()))
                        .map(Prevod::getPrevedenoBesedilo)
                        .findFirst()
                        .orElse("ni podatka");

                filtrirani.add(new FiltriranZapis(
                        beseda.getId(),
                        beseda.getTekst(),
                        beseda.getJezik(),
                        prevod,
                        Math.round(uspesnost * 100.0) / 100.0,
                        vsi
                ));
            }
        }

        filtrirani.sort(Comparator.comparingDouble(FiltriranZapis::getUspesnost));

        System.out.println("\nŠibke besede (uspešnost <= " + meja + " %):");
        System.out.printf("%-6s %-16s %-8s %-18s %-12s %-10s%n",
                "ID", "BESEDA", "JEZIK", "PREVOD", "USPEŠNOST", "POSKUSI");
        System.out.println("--------------------------------------------------------------------------");
        for (FiltriranZapis z : filtrirani) {
            System.out.printf("%-6s %-16s %-8s %-18s %-11.2f%% %-10d%n",
                    z.getId(), z.getBeseda(), z.getJezik(), z.getPrevod(), z.getUspesnost(), z.getSteviloPoskusov());
        }

        File jsonOut = new File("filtrirano.json");
        jsonMapper.writeValue(jsonOut, filtrirani);

        XmlMapper outputXmlMapper = XmlMapper.builder()
                .addModule(new JavaTimeModule())
                .defaultUseWrapper(false)
                .build();
        outputXmlMapper.enable(SerializationFeature.INDENT_OUTPUT);
        File xmlOut = new File("filtrirano.xml");
        outputXmlMapper.writeValue(xmlOut, new FiltriraniRezultati(filtrirani));

        System.out.println("\nIzvoz končan:");
        System.out.println("- " + jsonOut.getAbsolutePath());
        System.out.println("- " + xmlOut.getAbsolutePath());
    }

    private static <T> T readXml(XmlMapper mapper, String filePath, Class<T> clazz) throws Exception {
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IllegalArgumentException("Datoteka ni najdena: " + filePath);
        }
        return mapper.readValue(file, clazz);
    }
}
