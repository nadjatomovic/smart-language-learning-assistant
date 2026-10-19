package si.um.tids.languageassistant.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.ArrayList;
import java.util.List;

public class Besede {
    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "beseda")
    private List<Beseda> besede = new ArrayList<>();

    public List<Beseda> getBesede() { return besede; }
    public void setBesede(List<Beseda> besede) { this.besede = besede; }
}
