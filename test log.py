from easysnmp import Session

session = Session(hostname='demo.snmplabs.com', community='public', version=2)
system_description = session.get('sysDescr.0')

print(f'System Description: {system_description.value}')
