package si.um.tids.languageassistant.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.time.LocalDate;

public class Prevod {
    @JacksonXmlProperty(isAttribute = true)
    private String id;
    private String besedaId;
    private String ciljniJezik;
    private String prevedenoBesedilo;
    private LocalDate datumPrevoda;

    public Prevod() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBesedaId() { return besedaId; }
    public void setBesedaId(String besedaId) { this.besedaId = besedaId; }
    public String getCiljniJezik() { return ciljniJezik; }
    public void setCiljniJezik(String ciljniJezik) { this.ciljniJezik = ciljniJezik; }
    public String getPrevedenoBesedilo() { return prevedenoBesedilo; }
    public void setPrevedenoBesedilo(String prevedenoBesedilo) { this.prevedenoBesedilo = prevedenoBesedilo; }
    public LocalDate getDatumPrevoda() { return datumPrevoda; }
    public void setDatumPrevoda(LocalDate datumPrevoda) { this.datumPrevoda = datumPrevoda; }
}
