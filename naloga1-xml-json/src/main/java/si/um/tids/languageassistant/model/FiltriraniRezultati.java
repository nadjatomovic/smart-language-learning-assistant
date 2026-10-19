package si.um.tids.languageassistant.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.ArrayList;
import java.util.List;

public class FiltriraniRezultati {
    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "beseda")
    private List<FiltriranZapis> rezultati = new ArrayList<>();

    public FiltriraniRezultati() {}
    public FiltriraniRezultati(List<FiltriranZapis> rezultati) { this.rezultati = rezultati; }

    public List<FiltriranZapis> getRezultati() { return rezultati; }
    public void setRezultati(List<FiltriranZapis> rezultati) { this.rezultati = rezultati; }
}
