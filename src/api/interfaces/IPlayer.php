<?php
class IPlayer
{
    public $Id;
    public $Name;
    public $Position;
    public $Team;

    public function __construct($_Id, $_Name, $_Position, $_Team){
        $this->Id = (int)$_Id;
        $this->Name = $_Name;
        $this->Position = $_Position;
        $this->Team = $_Team;
    }
}
?>