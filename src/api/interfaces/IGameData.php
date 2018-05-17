<?php
class IGameData{
    public $Id;
    public $PaAtt;
    public $PaComp;
    public $PaYd;
    public $PaTd;
    public $PaInt;
    public $RuAtt;
    public $RuYds;
    public $RuTd;

    public function __construct($_Id, $_PaAtt, $_PaComp, $_PaYd, $_PaTd, $_PaInt, $_RuAtt, $_RuYds, $_RuTd)
    {
        $this->Id = (int)$_Id;
        $this->PaAtt = (int)$_PaAtt;
        $this->PaComp = (int)$_PaComp;
        $this->PaYd = (int)$_PaYd;
        $this->PaTd = (int)$_PaTd;
        $this->PaInt = (int)$_PaInt;
        $this->RuAtt = (int)$_RuAtt;
        $this->RuYds = (int)$_RuYds;
        $this->RuTd = (int)$_RuTd;
    }
}
?>