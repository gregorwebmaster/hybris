<?php
use PHPUnit\Framework\TestCase;

class StackTest extends TestCase
{
    public function testFailure()
    {
        $this->assertEquals(1, 0, '1 in not equqal to 0');
    }
}