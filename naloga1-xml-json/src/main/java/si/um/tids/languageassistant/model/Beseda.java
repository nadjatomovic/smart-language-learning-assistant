package si.um.tids.languageassistant.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.time.LocalDate;

public class Beseda {
    @JacksonXmlProperty(isAttribute = true)
    private String id;
    private String tekst;
    private String jezik;
    private String besednaVrsta;
    private String definicija;
    private String primer;
    private LocalDate datumDodajanja;
    private int tezavnost;

    public Beseda() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTekst() { return tekst; }
    public void setTekst(String tekst) { this.tekst = tekst; }
    public String getJezik() { return jezik; }
    public void setJezik(String jezik) { this.jezik = jezik; }
    public String getBesednaVrsta() { return besednaVrsta; }
    public void setBesednaVrsta(String besednaVrsta) { this.besednaVrsta = besednaVrsta; }
    public String getDefinicija() { return definicija; }
    public void setDefinicija(String definicija) { this.definicija = definicija; }
    public String getPrimer() { return primer; }
    public void setPrimer(String primer) { this.primer = primer; }
    public LocalDate getDatumDodajanja() { return datumDodajanja; }
    public void setDatumDodajanja(LocalDate datumDodajanja) { this.datumDodajanja = datumDodajanja; }
    public int getTezavnost() { return tezavnost; }
    public void setTezavnost(int tezavnost) { this.tezavnost = tezavnost; }
}
