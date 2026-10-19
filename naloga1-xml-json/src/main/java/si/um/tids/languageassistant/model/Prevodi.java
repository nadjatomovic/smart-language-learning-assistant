package si.um.tids.languageassistant.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.ArrayList;
import java.util.List;

public class Prevodi {
    @JacksonXmlElementWrapper(useWrapping = false)
    @JacksonXmlProperty(localName = "prevod")
    private List<Prevod> prevodi = new ArrayList<>();

    public List<Prevod> getPrevodi() { return prevodi; }
    public void setPrevodi(List<Prevod> prevodi) { this.prevodi = prevodi; }
}
