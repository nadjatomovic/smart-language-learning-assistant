package si.um.tids.languageassistant.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.ArrayList;
import java.util.List;

public class RezultatiKvizov {
    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "rezultat")
    private List<RezultatKviza> rezultati = new ArrayList<>();

    public List<RezultatKviza> getRezultati() { return rezultati; }
    public void setRezultati(List<RezultatKviza> rezultati) { this.rezultati = rezultati; }
}
