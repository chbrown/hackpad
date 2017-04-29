IDS := $(shell cat *-ids.txt)

all: $(IDS:%=html/%.html) $(IDS:%=revisions/%.json)

personal-ids.txt:
	hackpad-list > $@

html/%.html:
	@mkdir -p $(@D)
	hackpad-export $* > $@

revisions/%.json:
	@mkdir -p $(@D)
	hackpad-revisions $* > $@
